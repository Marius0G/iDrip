"""Shopping recommendation flow.

Pipeline:
  1. analyze_gaps      — LLM examines wardrobe + prefs, outputs 3-5 search queries
  2. web_search        — SerpAPI google_shopping for each query, retailer whitelist
                         post-filter; Tavily fallback if SerpAPI is unavailable
  3. rank_and_explain  — LLM picks the best ~8 results, writes a reason per pick
  4. format_output     — clamp scores, dedup, validate
"""

from __future__ import annotations

import json
import logging
import os
import re
from typing import Any, Dict, List, Optional, TypedDict
from urllib.parse import urlparse

import httpx
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import END, StateGraph

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "").strip()
TAVILY_KEY = os.getenv("TAVILY_KEY", "").strip()

# Retailer whitelist — anything outside this set is filtered out.
# Key: lowercase domain root. Value: human-friendly brand label.
RETAILER_WHITELIST: Dict[str, str] = {
    # First-party retailers
    "nike.com": "Nike",
    "adidas.com": "Adidas",
    "zara.com": "Zara",
    "asos.com": "ASOS",
    "uniqlo.com": "Uniqlo",
    "hm.com": "H&M",
    "cosstores.com": "COS",
    "everlane.com": "Everlane",
    # Secondhand / resale marketplaces (broaden coverage for jerseys, vintage,
    # streetwear that the first-party set above doesn't carry second-season).
    "vinted.com": "Vinted",
    "vinted.co.uk": "Vinted",
    "depop.com": "Depop",
    "grailed.com": "Grailed",
    "ebay.com": "eBay",
}
ALLOWED_DOMAINS = sorted(set(RETAILER_WHITELIST.keys()))

# Image CDN hostnames per brand. SerpAPI's google_shopping engine sometimes
# mixes thumbnails between adjacent rows (Zara product / H&M image), so we
# reject rows where the image host isn't associated with the brand.
# Marketplaces are exempt (sellers upload from anywhere).
BRAND_IMAGE_HOSTS: Dict[str, List[str]] = {
    "Nike": ["nike.com", "nike.net"],
    "Adidas": ["adidas.com"],
    "Zara": ["zara.net", "zara.com"],
    "ASOS": ["asos-media.com", "asos.com"],
    "Uniqlo": ["uniqlo.com"],
    "H&M": ["hm.com", "hmgoepprod.com"],
    "COS": ["cosstores.com", "cos.com"],
    "Everlane": ["everlane.com"],
    "Vinted": [],
    "Depop": [],
    "Grailed": [],
    "eBay": [],
}


def _image_matches_brand(image_url: str, brand: str) -> bool:
    """True if the image is on a CDN associated with the brand (or the brand is
    a marketplace with no canonical image host)."""
    hosts = BRAND_IMAGE_HOSTS.get(brand)
    if hosts is None:
        return True  # unknown brand — don't gate
    if not hosts:
        return True  # marketplace — accept any seller-uploaded image
    host = (urlparse(image_url).hostname or "").lower()
    # SerpAPI google_shopping often serves thumbnails through Google's image
    # proxy (encrypted-tbn*.gstatic.com) rather than the retailer's own CDN.
    # Google picks the image, so we trust it as much as the brand's CDN.
    if host == "gstatic.com" or host.endswith(".gstatic.com"):
        return True
    return any(host == h or host.endswith(f".{h}") for h in hosts)

MAX_QUERIES = 4
RESULTS_PER_QUERY = 20
FINAL_RECOMMENDATIONS = 8


# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------
class RecState(TypedDict):
    user_id: str
    wardrobe_items: List[Dict[str, Any]]
    preferences: Dict[str, Any]
    queries: List[Dict[str, Any]]           # [{query, target_category, max_price}]
    raw_results: List[Dict[str, Any]]        # flattened SerpAPI/Tavily results
    recommendations: List[Dict[str, Any]]    # final, ranked + reasoned
    errors: List[str]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _summarize_wardrobe(items: List[Dict[str, Any]]) -> str:
    """Compact wardrobe summary for the LLM prompt — includes brand + tags so
    the LLM can pick up affinities (e.g. a user with multiple Barça shirts
    likely wants more Barça-aligned recs)."""
    by_cat: Dict[str, List[str]] = {}
    for it in items:
        cat = str(it.get("category", "other"))
        name = str(it.get("name", "item"))
        color = it.get("primaryColor", "")
        brand = str(it.get("brand", "")).strip()
        style = ",".join(it.get("style", [])[:2]) if isinstance(it.get("style"), list) else ""
        tags = ",".join(it.get("tags", [])[:3]) if isinstance(it.get("tags"), list) else ""
        bits = [name]
        if brand:
            bits.append(f"{{brand: {brand}}}")
        if color:
            bits.append(f"({color})")
        if style:
            bits.append(f"[style: {style}]")
        if tags:
            bits.append(f"[tags: {tags}]")
        by_cat.setdefault(cat, []).append(" ".join(bits))
    return "\n".join(f"- {cat}: {'; '.join(names[:8])}" for cat, names in by_cat.items())


def _extract_json(text: str) -> Optional[Any]:
    text = text.strip()
    fence = re.match(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence:
        text = fence.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    m = re.search(r"[\[{][\s\S]*[\]}]", text)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            return None
    return None


def _domain_of(url: str) -> str:
    try:
        host = (urlparse(url).hostname or "").lower()
        # NOTE: must use removeprefix, not lstrip — lstrip strips a *set of chars*.
        if host.startswith("www."):
            host = host[4:]
        return host
    except Exception:
        return ""


def _domain_in_whitelist(url: str) -> Optional[str]:
    """Return human label iff URL host exactly matches a whitelist entry or is a
    legitimate subdomain (e.g. shop.nike.com → nike.com).

    Substring matches are deliberately rejected to prevent typosquat bypass
    (e.g. fakeasos.com, nike.com.evil.io)."""
    host = _domain_of(url)
    if not host:
        return None
    for allowed, label in RETAILER_WHITELIST.items():
        if host == allowed or host.endswith("." + allowed):
            return label
    return None


# ---------------------------------------------------------------------------
# Node 1: analyze_gaps — LLM decides what to search for
# ---------------------------------------------------------------------------
GAP_ANALYSIS_PROMPT = """You are a fashion stylist analyzing a client's wardrobe to recommend purchases.

Given:
- The client's existing wardrobe (by category, with brand and tags per item)
- Their preferred styles (e.g., minimalist, streetwear)
- Their budget ceiling per item

Output 3-4 specific shopping queries that either FILL GAPS or REINFORCE strong signals already in the wardrobe.

Personalization signals to PAY ATTENTION TO:
- **Recurring brands** — if the client has multiple Nike pieces, lean into Nike. If multiple Zara, lean into Zara.
- **Themes in tags or names** — e.g., "barca" / "fc barcelona", a sports team, a music artist, a specific subculture (techwear, gorpcore, y2k). Reinforce these explicitly in the query when present.
- **Color palette** — match or complement the dominant tones.

Output rules:
- Each query is 3-7 words, lowercase, no punctuation
- Bake brand/theme into the query when the signal is strong (e.g. "fc barcelona jersey 25 26", "nike tech fleece pants")
- Stay realistic for the budget (don't recommend $500 items if budget is $80)
- Mix: 1-2 queries should fill a gap, 1-2 should reinforce a recurring signal
- Don't repeat items the client already has

Return ONLY a JSON array of objects with this exact shape:
[
  {"query": "fc barcelona home jersey", "target_category": "tops", "max_price": 80, "rationale": "client owns 2 barca items — reinforce theme"}
]
"""


def analyze_gaps(state: RecState, llm) -> RecState:
    prefs = state["preferences"]
    wardrobe = state["wardrobe_items"]

    user_msg = (
        f"## WARDROBE\n{_summarize_wardrobe(wardrobe)}\n\n"
        f"## PREFERENCES\n"
        f"- styles: {', '.join(prefs.get('styles', [])) or 'none'}\n"
        f"- favorite colors: {', '.join(prefs.get('favorite_colors', [])) or 'none'}\n"
        f"- budget per item: ${prefs.get('budget_min', 0)} – ${prefs.get('budget_max', 200)}\n\n"
        f"## TASK\nGenerate 3-4 shopping queries. Return JSON array only."
    )

    try:
        resp = llm.invoke([SystemMessage(content=GAP_ANALYSIS_PROMPT), HumanMessage(content=user_msg)])
        content = str(resp.content if hasattr(resp, "content") else resp).strip()
        parsed = _extract_json(content)
        if not isinstance(parsed, list):
            raise ValueError(f"Expected list, got: {type(parsed).__name__}")

        cleaned: List[Dict[str, Any]] = []
        for q in parsed[:MAX_QUERIES]:
            if not isinstance(q, dict) or not q.get("query"):
                continue
            cleaned.append({
                "query": str(q["query"]).strip().lower(),
                "target_category": str(q.get("target_category", "")).lower(),
                "max_price": float(q.get("max_price") or prefs.get("budget_max", 200)),
                "rationale": str(q.get("rationale", "")),
            })

        state["queries"] = cleaned
        logger.info(f"analyze_gaps produced {len(cleaned)} queries")
    except Exception as exc:
        logger.error(f"analyze_gaps failed: {exc}")
        state["errors"].append(f"Gap analysis failed: {exc}")
        state["queries"] = []

    return state


# ---------------------------------------------------------------------------
# Node 2: web_search — SerpAPI google_shopping + Tavily fallback
# ---------------------------------------------------------------------------
def _serpapi_shopping(query: str, max_price: float) -> List[Dict[str, Any]]:
    """Call SerpAPI google_shopping. Returns whitelist-filtered results."""
    if not SERPAPI_KEY:
        return []

    params = {
        "engine": "google_shopping",
        "q": query,
        "api_key": SERPAPI_KEY,
        "gl": "us",
        "hl": "en",
        "num": RESULTS_PER_QUERY,
    }
    try:
        with httpx.Client(timeout=20.0) as client:
            resp = client.get("https://serpapi.com/search", params=params)
            resp.raise_for_status()
            data = resp.json()
    except Exception as exc:
        # Log exception type only — exc str / repr can include the api_key from the URL.
        logger.warning(f"SerpAPI call failed for '{query}': {type(exc).__name__}")
        return []

    out: List[Dict[str, Any]] = []
    for r in (data.get("shopping_results") or []):
        link = r.get("product_link") or r.get("link") or ""
        label = _domain_in_whitelist(link)

        # SerpAPI's google_shopping engine often returns Google Shopping
        # redirect URLs (host=google.com) instead of direct retailer URLs. In
        # that case the URL is Google-controlled, so we can trust the `source`
        # field as the retailer label. Outside of google.com URLs the source
        # is untrusted display text — using it then would defeat the whitelist.
        if not label:
            link_host = (urlparse(link).hostname or "").lower()
            if link_host == "google.com" or link_host == "www.google.com":
                src = (r.get("source") or "").strip().lower()
                for allowed_label in RETAILER_WHITELIST.values():
                    if src == allowed_label.lower():
                        label = allowed_label
                        break

        if not label:
            continue

        price = r.get("extracted_price")
        if price is None:
            continue
        try:
            price = float(price)
        except (TypeError, ValueError):
            continue
        if price > max_price:
            continue

        out.append({
            "source": "serpapi",
            "brand": label,
            "title": r.get("title", ""),
            "price": price,
            "url": link,
            "image": r.get("thumbnail", ""),
            "snippet": r.get("snippet", "") or r.get("description", ""),
        })
    return out


def _tavily_fallback(query: str, max_price: float) -> List[Dict[str, Any]]:
    """Generic web search fallback. Less structured — no price guarantees."""
    if not TAVILY_KEY:
        return []
    body = {
        "api_key": TAVILY_KEY,
        "query": f"{query} buy online",
        "max_results": 8,
        "include_domains": ALLOWED_DOMAINS,
        "include_images": True,
    }
    try:
        with httpx.Client(timeout=20.0) as client:
            resp = client.post("https://api.tavily.com/search", json=body)
            resp.raise_for_status()
            data = resp.json()
    except Exception as exc:
        logger.warning(f"Tavily call failed for '{query}': {type(exc).__name__}")
        return []

    out: List[Dict[str, Any]] = []
    images = data.get("images") or []
    for i, r in enumerate(data.get("results", [])):
        link = r.get("url", "")
        label = _domain_in_whitelist(link)
        if not label:
            continue
        out.append({
            "source": "tavily",
            "brand": label,
            "title": r.get("title", ""),
            "price": None,  # Tavily doesn't return structured price
            "url": link,
            "image": images[i] if i < len(images) else "",
            "snippet": (r.get("content") or "")[:200],
        })
    return out


def web_search(state: RecState) -> RecState:
    results: List[Dict[str, Any]] = []
    for q in state["queries"]:
        primary = _serpapi_shopping(q["query"], q["max_price"])
        if primary:
            for r in primary:
                r["query"] = q["query"]
                r["target_category"] = q["target_category"]
            results.extend(primary)
            continue

        # Fallback for this query only — SerpAPI returned nothing whitelisted.
        secondary = _tavily_fallback(q["query"], q["max_price"])
        for r in secondary:
            r["query"] = q["query"]
            r["target_category"] = q["target_category"]
        results.extend(secondary)

    state["raw_results"] = results
    logger.info(f"web_search collected {len(results)} whitelisted results across {len(state['queries'])} queries")
    if not results:
        state["errors"].append("No products found in whitelisted retailers")
    return state


# ---------------------------------------------------------------------------
# Node 3: rank_and_explain — LLM picks the final list and writes reasons
# ---------------------------------------------------------------------------
RANK_PROMPT = """You are an expert stylist scoring shopping candidates for a client.

Given the client's wardrobe summary and a list of candidate products (with title, brand, price, snippet), pick the BEST {n} products and explain why each fits THEIR specific wardrobe.

Rules:
- Each pick must reference something specific about the wardrobe in `reason` (e.g., "pairs with your white oxford")
- `matchScore` is 60-99 (int); reserve 90+ for genuinely outstanding fits
- Output ONLY a JSON array. Each element must include the `id` from the input candidate AND your matchScore + reason.
- Do not invent products — only pick from the candidate `id`s provided
- Prefer variety in category and price across your picks

Return exactly this shape:
[
  {{"id": "cand-3", "matchScore": 92, "reason": "Pairs with your black slim jeans for a smart-casual evening"}}
]
"""


def rank_and_explain(state: RecState, llm) -> RecState:
    raw = state["raw_results"]
    if not raw:
        state["recommendations"] = []
        return state

    # Assign stable ids and trim before sending to LLM
    candidates = []
    for i, r in enumerate(raw):
        candidates.append({
            "id": f"cand-{i}",
            "title": r["title"][:120],
            "brand": r["brand"],
            "price": r["price"],
            "category": r["target_category"],
            "snippet": (r.get("snippet") or "")[:160],
        })

    wardrobe_summary = _summarize_wardrobe(state["wardrobe_items"])
    user_msg = (
        f"## WARDROBE\n{wardrobe_summary}\n\n"
        f"## CANDIDATES (id → product)\n{json.dumps(candidates, indent=2)}\n\n"
        f"## TASK\nPick the best {min(FINAL_RECOMMENDATIONS, len(candidates))} products. Return JSON array only."
    )

    try:
        resp = llm.invoke([
            SystemMessage(content=RANK_PROMPT.format(n=min(FINAL_RECOMMENDATIONS, len(candidates)))),
            HumanMessage(content=user_msg),
        ])
        content = str(resp.content if hasattr(resp, "content") else resp).strip()
        parsed = _extract_json(content)
        if not isinstance(parsed, list):
            raise ValueError(f"Expected list, got: {type(parsed).__name__}")
    except Exception as exc:
        logger.error(f"rank_and_explain failed: {exc}")
        state["errors"].append(f"Ranking failed: {exc}")
        # Degrade gracefully — return top N with generic reasons, skipping price-less rows.
        recs: List[Dict[str, Any]] = []
        for i, r in enumerate(raw):
            fin = _finalize_rec(f"rec-{i}", r, 75, f"Matches your search for {r.get('query', 'this item')}")
            if fin is not None:
                recs.append(fin)
            if len(recs) >= FINAL_RECOMMENDATIONS:
                break
        state["recommendations"] = recs
        return state

    cand_by_id = {c["id"]: i for i, c in enumerate(candidates)}
    recs: List[Dict[str, Any]] = []
    for j, pick in enumerate(parsed):
        if not isinstance(pick, dict):
            continue
        cid = pick.get("id")
        idx = cand_by_id.get(cid)
        if idx is None:
            continue
        raw_item = raw[idx]
        score = pick.get("matchScore", 80)
        try:
            score = max(60, min(99, int(score)))
        except (TypeError, ValueError):
            score = 80
        reason = str(pick.get("reason", "")).strip() or "Fits your style and budget"
        fin = _finalize_rec(f"rec-{j}", raw_item, score, reason)
        if fin is not None:
            recs.append(fin)

    state["recommendations"] = recs[:FINAL_RECOMMENDATIONS]
    logger.info(f"rank_and_explain finalized {len(state['recommendations'])} recommendations")
    return state


def _finalize_rec(rec_id: str, raw: Dict[str, Any], score: int, reason: str) -> Optional[Dict[str, Any]]:
    """Build the final recommendation. Returns None for rows missing critical
    fields — price (Tavily fallback often lacks it) or a real image (placeholder
    cards look broken in the UI). Dropping early keeps the cache clean."""
    price_val = raw.get("price")
    try:
        price = float(price_val) if price_val is not None else 0.0
    except (TypeError, ValueError):
        price = 0.0
    if price <= 0:
        return None

    image = (raw.get("image") or "").strip()
    parsed_image = urlparse(image) if image else None
    image_host = (parsed_image.hostname or "").lower() if parsed_image else ""
    if not image or image_host == "placehold.co" or image_host.endswith(".placehold.co"):
        return None

    # Reject rows where the image host doesn't match the brand — SerpAPI sometimes
    # cross-contaminates thumbnails between adjacent shopping results (e.g. a Zara
    # product card with an H&M image). Without this check those cards look broken
    # even though the rest of the fields are correct.
    brand = raw.get("brand", "")
    if not _image_matches_brand(image, brand):
        return None

    return {
        "id": rec_id,
        "name": raw.get("title", "Product")[:120],
        "brand": raw.get("brand", ""),
        "category": raw.get("target_category", "") or "tops",
        "price": price,
        "imageUrl": image,
        "matchScore": score,
        "matchReason": reason,
        "description": (raw.get("snippet") or raw.get("title", ""))[:200],
        "tags": [raw.get("brand", "").lower(), raw.get("target_category", "")],
        "productUrl": raw.get("url", ""),
    }


# ---------------------------------------------------------------------------
# Build the graph
# ---------------------------------------------------------------------------
def build_recommend_graph(llm):
    graph = StateGraph(RecState)
    graph.add_node("analyze_gaps", lambda s: analyze_gaps(s, llm))
    graph.add_node("web_search", web_search)
    graph.add_node("rank_and_explain", lambda s: rank_and_explain(s, llm))

    graph.set_entry_point("analyze_gaps")
    graph.add_conditional_edges(
        "analyze_gaps",
        lambda s: "web_search" if s["queries"] else END,
        {"web_search": "web_search", END: END},
    )
    graph.add_conditional_edges(
        "web_search",
        lambda s: "rank_and_explain" if s["raw_results"] else END,
        {"rank_and_explain": "rank_and_explain", END: END},
    )
    graph.add_edge("rank_and_explain", END)

    return graph.compile()
