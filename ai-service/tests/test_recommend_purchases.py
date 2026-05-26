"""Tests for the shopping recommendation flow: whitelist filter, SerpAPI/Tavily
parsing, and graceful failure modes."""
import pytest
from unittest.mock import patch, MagicMock


# ---------------------------------------------------------------------------
# Unit tests: pure functions (no LLM, no network)
# ---------------------------------------------------------------------------
class TestDomainWhitelist:
    def test_accepts_exact_match(self):
        import recommend_purchases as rp
        assert rp._domain_in_whitelist("https://www.nike.com/product") == "Nike"

    def test_accepts_subdomain(self):
        import recommend_purchases as rp
        assert rp._domain_in_whitelist("https://shop.nike.com/x") == "Nike"

    def test_rejects_outside_whitelist(self):
        import recommend_purchases as rp
        assert rp._domain_in_whitelist("https://amazon.com/abc") is None
        assert rp._domain_in_whitelist("https://shein.com/xyz") is None

    def test_handles_empty_or_malformed(self):
        import recommend_purchases as rp
        assert rp._domain_in_whitelist("") is None
        assert rp._domain_in_whitelist("not-a-url") is None

    def test_rejects_typosquat_and_substring_attacks(self):
        """Regression: substring matches and lstrip-stripped prefixes must not pass."""
        import recommend_purchases as rp
        # fakenike.com once passed because 'nike.com' was an `in` substring of host
        assert rp._domain_in_whitelist("https://fakenike.com/scam") is None
        # 'nike.com.evil.io' must not pass — same root issue
        assert rp._domain_in_whitelist("https://nike.com.evil.io/scam") is None
        # wwwnike.com used to lstrip to 'ike.com' (lstrip strips a char class!)
        assert rp._domain_in_whitelist("https://wwwnike.com/x") is None
        # Legitimate subdomain still passes
        assert rp._domain_in_whitelist("https://shop.nike.com/x") == "Nike"
        # Bare www. variant resolves cleanly
        assert rp._domain_in_whitelist("https://www.nike.com/x") == "Nike"


class TestJsonExtraction:
    def test_parses_clean_json(self):
        import recommend_purchases as rp
        assert rp._extract_json('[{"a":1}]') == [{"a": 1}]

    def test_parses_code_fenced_json(self):
        import recommend_purchases as rp
        out = rp._extract_json('```json\n[{"q":"x"}]\n```')
        assert out == [{"q": "x"}]

    def test_extracts_from_surrounding_text(self):
        import recommend_purchases as rp
        out = rp._extract_json('Sure thing! Here:\n[{"x":1}]\nDone.')
        assert out == [{"x": 1}]

    def test_returns_none_on_garbage(self):
        import recommend_purchases as rp
        assert rp._extract_json("totally not json") is None


class TestWardrobeSummary:
    def test_groups_by_category(self):
        import recommend_purchases as rp
        items = [
            {"name": "Oxford", "category": "tops", "primaryColor": "#fff", "style": ["minimalist"]},
            {"name": "Tee", "category": "tops"},
            {"name": "Jeans", "category": "bottoms"},
        ]
        summary = rp._summarize_wardrobe(items)
        assert "tops:" in summary
        assert "bottoms:" in summary
        assert "Oxford" in summary
        assert "Jeans" in summary


# ---------------------------------------------------------------------------
# Search node tests: mocked HTTP
# ---------------------------------------------------------------------------
class TestSerpApiShopping:
    def test_returns_empty_when_no_key(self, monkeypatch):
        import importlib
        import recommend_purchases as rp
        monkeypatch.setattr(rp, "SERPAPI_KEY", "")
        assert rp._serpapi_shopping("anything", 100) == []

    def test_filters_to_whitelist_and_budget(self, monkeypatch):
        import recommend_purchases as rp
        monkeypatch.setattr(rp, "SERPAPI_KEY", "fake-key")

        fake_response = MagicMock()
        fake_response.json.return_value = {
            "shopping_results": [
                {"title": "Nike Tee", "product_link": "https://nike.com/x", "extracted_price": 25, "thumbnail": "img1"},
                {"title": "Random", "product_link": "https://amazon.com/y", "extracted_price": 15, "thumbnail": "img2"},
                {"title": "Over Budget", "product_link": "https://zara.com/z", "extracted_price": 500, "thumbnail": "img3"},
                {"title": "Uniqlo Shirt", "link": "https://uniqlo.com/a", "extracted_price": 40, "thumbnail": "img4"},
                # The `source` string alone must NOT bypass the URL whitelist
                {"title": "Spoofed Nike", "source": "Nike", "product_link": "https://shein.com/junk", "extracted_price": 12, "thumbnail": "img5"},
            ]
        }
        fake_response.raise_for_status = MagicMock()

        with patch("httpx.Client") as mock_client_cls:
            mock_client = MagicMock()
            mock_client.__enter__ = MagicMock(return_value=mock_client)
            mock_client.__exit__ = MagicMock(return_value=False)
            mock_client.get.return_value = fake_response
            mock_client_cls.return_value = mock_client

            results = rp._serpapi_shopping("test query", 100)

        # Keep Nike + Uniqlo. Drop Amazon (off-list), Zara (over budget), and the
        # spoofed Nike-source-but-shein-URL row (source claims are not trusted).
        assert len(results) == 2
        brands = sorted(r["brand"] for r in results)
        assert brands == ["Nike", "Uniqlo"]

    def test_swallows_network_errors(self, monkeypatch):
        import recommend_purchases as rp
        monkeypatch.setattr(rp, "SERPAPI_KEY", "fake-key")
        with patch("httpx.Client", side_effect=Exception("boom")):
            assert rp._serpapi_shopping("q", 100) == []


class TestTavilyFallback:
    def test_returns_empty_when_no_key(self, monkeypatch):
        import recommend_purchases as rp
        monkeypatch.setattr(rp, "TAVILY_KEY", "")
        assert rp._tavily_fallback("q", 100) == []

    def test_filters_to_whitelist(self, monkeypatch):
        import recommend_purchases as rp
        monkeypatch.setattr(rp, "TAVILY_KEY", "fake-key")

        fake_response = MagicMock()
        fake_response.json.return_value = {
            "results": [
                {"title": "ASOS Shirt", "url": "https://asos.com/x", "content": "Nice shirt"},
                {"title": "Off-list", "url": "https://temu.com/y", "content": "junk"},
            ],
            "images": ["img1", "img2"],
        }
        fake_response.raise_for_status = MagicMock()

        with patch("httpx.Client") as mock_client_cls:
            mock_client = MagicMock()
            mock_client.__enter__ = MagicMock(return_value=mock_client)
            mock_client.__exit__ = MagicMock(return_value=False)
            mock_client.post.return_value = fake_response
            mock_client_cls.return_value = mock_client

            results = rp._tavily_fallback("query", 100)

        assert len(results) == 1
        assert results[0]["brand"] == "ASOS"


# ---------------------------------------------------------------------------
# Finalize-rec output shape
# ---------------------------------------------------------------------------
class TestFinalizeRec:
    def test_produces_full_shape(self):
        import recommend_purchases as rp
        raw = {
            "title": "White Linen Shirt",
            "brand": "Uniqlo",
            "target_category": "tops",
            "price": 40.0,
            "image": "https://example.com/i.jpg",
            "url": "https://uniqlo.com/x",
            "snippet": "Breathable summer shirt.",
        }
        rec = rp._finalize_rec("rec-1", raw, 92, "Pairs with your jeans")
        assert rec is not None
        assert rec["id"] == "rec-1"
        assert rec["name"] == "White Linen Shirt"
        assert rec["brand"] == "Uniqlo"
        assert rec["category"] == "tops"
        assert rec["price"] == 40.0
        assert rec["matchScore"] == 92
        assert rec["matchReason"] == "Pairs with your jeans"
        assert rec["productUrl"] == "https://uniqlo.com/x"

    def test_drops_priceless_rows(self):
        """Tavily fallback results have no price — they would always pass the
        frontend budget filter, so they must be dropped at the source."""
        import recommend_purchases as rp
        assert rp._finalize_rec("r1", {"title": "x", "brand": "ASOS", "target_category": "tops", "price": None}, 80, "fits") is None
        assert rp._finalize_rec("r2", {"title": "x", "brand": "ASOS", "target_category": "tops", "price": 0}, 80, "fits") is None
        assert rp._finalize_rec("r3", {"title": "x", "brand": "ASOS", "target_category": "tops"}, 80, "fits") is None

    def test_drops_rows_without_real_image(self):
        """Placeholder images make the grid look broken — drop rows with no image."""
        import recommend_purchases as rp
        base = {"title": "x", "brand": "Nike", "target_category": "shoes", "price": 50, "url": "https://nike.com/x"}
        # Missing
        assert rp._finalize_rec("r1", base, 80, "fits") is None
        # Empty string
        assert rp._finalize_rec("r2", {**base, "image": ""}, 80, "fits") is None
        # placehold.co URL is a known placeholder
        assert rp._finalize_rec("r3", {**base, "image": "https://placehold.co/400x500/cccccc/000000?text=No+Image"}, 80, "fits") is None
        # Real CDN image passes
        rec = rp._finalize_rec("r4", {**base, "image": "https://static.nike.com/a/images/x.png"}, 80, "fits")
        assert rec is not None
        assert rec["imageUrl"] == "https://static.nike.com/a/images/x.png"


# ---------------------------------------------------------------------------
# Endpoint: /recommend-purchases
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_recommend_purchases_returns_503_when_no_llm_key(client, monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "")
    monkeypatch.setenv("OPENAI_API_KEY", "")

    import importlib
    import main as main_module
    importlib.reload(main_module)
    from httpx import ASGITransport, AsyncClient
    transport = ASGITransport(app=main_module.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post(
            "/recommend-purchases",
            json={"user_id": "u1", "wardrobe_items": [], "preferences": {}},
        )

    assert res.status_code == 503
    assert "not configured" in res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_recommend_purchases_returns_recs_when_agent_succeeds(client, monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "sk-fake-for-tests")

    import importlib
    import main as main_module
    importlib.reload(main_module)
    import recommend_purchases as rp
    importlib.reload(rp)

    fake_agent = MagicMock()
    fake_agent.invoke.return_value = {
        "user_id": "u1",
        "wardrobe_items": [],
        "preferences": {},
        "queries": [],
        "raw_results": [],
        "recommendations": [
            {
                "id": "rec-0",
                "name": "White Linen Shirt",
                "brand": "Uniqlo",
                "category": "tops",
                "price": 40,
                "imageUrl": "https://example.com/i.jpg",
                "matchScore": 92,
                "matchReason": "Pairs with your jeans",
                "description": "Breathable summer top",
                "tags": ["minimalist"],
                "productUrl": "https://uniqlo.com/x",
            }
        ],
        "errors": [],
    }

    with patch.object(rp, "build_recommend_graph", return_value=fake_agent):
        from httpx import ASGITransport, AsyncClient
        transport = ASGITransport(app=main_module.app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            res = await ac.post(
                "/recommend-purchases",
                json={
                    "user_id": "u1",
                    "wardrobe_items": [{"id": "w1", "name": "Jeans", "category": "bottoms"}],
                    "preferences": {"styles": ["minimalist"], "budget_max": 60},
                },
            )

    assert res.status_code == 200
    body = res.json()
    assert body["count"] == 1
    assert body["recommendations"][0]["brand"] == "Uniqlo"
    assert body["recommendations"][0]["matchScore"] == 92


@pytest.mark.asyncio
async def test_recommend_purchases_returns_422_when_no_recs_and_errors(client, monkeypatch):
    monkeypatch.setenv("LLM_API_KEY", "sk-fake-for-tests")

    import importlib
    import main as main_module
    importlib.reload(main_module)
    import recommend_purchases as rp
    importlib.reload(rp)

    fake_agent = MagicMock()
    fake_agent.invoke.return_value = {
        "user_id": "u1",
        "wardrobe_items": [],
        "preferences": {},
        "queries": [],
        "raw_results": [],
        "recommendations": [],
        "errors": ["No products found in whitelisted retailers"],
    }

    with patch.object(rp, "build_recommend_graph", return_value=fake_agent):
        from httpx import ASGITransport, AsyncClient
        transport = ASGITransport(app=main_module.app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            res = await ac.post(
                "/recommend-purchases",
                json={"user_id": "u1", "wardrobe_items": [], "preferences": {}},
            )

    assert res.status_code == 422
    assert "errors" in res.json()["detail"]
