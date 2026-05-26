import { Router, Request, Response } from 'express';
import { MOCK_RECOMMENDATIONS } from '../seed/data';
import { generateRecommendationsAI } from '../services/aiRecommendationService';
import WardrobeItem from '../models/WardrobeItem';
import User from '../models/User';
import RecommendationCache from '../models/RecommendationCache';
import SavedRecommendation from '../models/SavedRecommendation';
import DismissedRecommendation from '../models/DismissedRecommendation';

// Stable identity for a recommendation across regenerations — productUrl
// when available, otherwise the name (matches the frontend's dismissKey).
function stableKeyOf(r: { productUrl?: string; name: string }): string {
  return (r.productUrl && r.productUrl.trim()) || r.name;
}

const router = Router();

interface RawRec {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  matchScore: number;
  matchReason: string;
  description?: string;
  tags?: string[];
  productUrl?: string;
}

function toFrontendShape(r: RawRec) {
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    category: r.category,
    estimatedPrice: r.price,
    imageUrl: r.imageUrl,
    matchScore: r.matchScore,
    reason: r.matchReason,
    description: r.description || `${r.brand} ${r.name}`,
    tags: r.tags || [r.category],
    productUrl: r.productUrl,
  };
}

// Cache TTL is intentionally long — invalidation happens via wardrobe
// fingerprint, not the clock; this is just garbage collection.
const CACHE_TTL_HOURS = 24 * 30;
const isAiEnabled = () => !!process.env.AI_SERVICE_URL;

interface WardrobeFingerprintDoc {
  _id: unknown;
  updatedAt?: Date;
}

function fingerprintWardrobe(items: WardrobeFingerprintDoc[]): string {
  if (items.length === 0) return 'empty';
  let maxTs = 0;
  for (const it of items) {
    const ts = it.updatedAt ? new Date(it.updatedAt).getTime() : 0;
    if (ts > maxTs) maxTs = ts;
  }
  return `${items.length}-${maxTs}`;
}

router.get('/', async (req: Request, res: Response) => {
  const userId = req.userId!;
  const { budget, style, force } = req.query;
  // `?force=1` (or `force=true`) bypasses the cache. The frontend Refresh
  // button sends this so users can pull fresh AI picks without having to edit
  // their wardrobe to bust the fingerprint.
  const skipCache = force === '1' || force === 'true';

  const maxBudget = budget ? Number(budget) : undefined;
  const styles = typeof style === 'string'
    ? style.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  // Bucket budget so tiny slider tweaks hit cache.
  const budgetBucket = maxBudget ? Math.round(maxBudget / 25) * 25 : 'any';
  const stylesPart = [...styles].sort().join('|');

  if (isAiEnabled()) {
    // Fetch wardrobe + user in one round-trip; we need wardrobe for fingerprint anyway.
    const [wardrobe, user] = await Promise.all([
      WardrobeItem.find({ userId }).lean(),
      User.findById(userId).lean(),
    ]);

    const fingerprint = fingerprintWardrobe(wardrobe);
    const cacheKey = `${stylesPart}|${budgetBucket}|${fingerprint}`;

    if (!skipCache) {
      const cached = await RecommendationCache.findOne({ userId, cacheKey });
      if (cached) {
        res.json({
          recommendations: cached.recommendations.map(toFrontendShape),
          count: cached.recommendations.length,
          cached: true,
        });
        return;
      }
    }

    try {
      const aiRecs = await generateRecommendationsAI({
        user_id: String(userId),
        wardrobe_items: wardrobe.map((w) => ({ ...w, id: String(w._id) })),
        preferences: {
          styles: styles.length ? styles : user?.preferences?.styles || [],
          favorite_colors: user?.preferences?.favoriteColors || [],
          budget_min: user?.preferences?.budgetMin || 0,
          budget_max: maxBudget ?? user?.preferences?.budgetMax ?? 200,
          sizes: user?.preferences?.sizes,
        },
      });

      if (aiRecs.length > 0) {
        // Filter out anything the user has permanently dismissed.
        const dismissedKeys = new Set(
          (await DismissedRecommendation.find({ userId }).select('stableKey').lean()).map((d) => d.stableKey)
        );
        const filtered = aiRecs.filter((r) => !dismissedKeys.has(stableKeyOf(r)));

        // Upsert: a parallel request may have populated the same key already.
        await RecommendationCache.findOneAndUpdate(
          { userId, cacheKey },
          {
            userId,
            cacheKey,
            recommendations: filtered,
            expiresAt: new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000),
          },
          { upsert: true, new: true }
        );
        res.json({
          recommendations: filtered.map(toFrontendShape),
          count: filtered.length,
          cached: false,
        });
        return;
      }
      // Empty AI result → fall through to mocks below.
    } catch (err: any) {
      console.warn('[recommendations] AI service failed, falling back to mocks:', err.message);
      // Fall through to mocks.
    }
  }

  // Mock fallback (AI disabled, AI failed, or AI returned empty).
  let results: RawRec[] = [...MOCK_RECOMMENDATIONS];

  if (maxBudget !== undefined) {
    results = results.filter((r) => r.price <= maxBudget);
  }

  if (styles.length > 0) {
    results = results.filter((r) =>
      styles.some((s) => r.matchReason.toLowerCase().includes(s) || r.category.includes(s))
    );
  }

  results.sort((a, b) => b.matchScore - a.matchScore);
  res.json({
    recommendations: results.map(toFrontendShape),
    count: results.length,
    cached: false,
  });
});

// Wipe all cached recommendations for the current user. Used by the "Refresh"
// button so a single click guarantees a clean regeneration across every
// (style, budget, fingerprint) combo — not just the one currently in view.
router.delete('/cache', async (req: Request, res: Response) => {
  const userId = req.userId!;
  const result = await RecommendationCache.deleteMany({ userId });
  res.json({ deleted: result.deletedCount ?? 0 });
});

// Save an item from the spotlight to the user's history. The full rec is
// stored (LLM-assigned spotlight `id`s rotate, so we can't reference by id).
router.post('/save', async (req: Request, res: Response) => {
  const userId = req.userId!;
  const item = req.body?.item;
  if (!item || !item.name) {
    res.status(400).json({ error: 'item is required' });
    return;
  }
  const stableKey = stableKeyOf(item);
  const saved = await SavedRecommendation.findOneAndUpdate(
    { userId, stableKey },
    { userId, stableKey, item, savedAt: new Date() },
    { upsert: true, new: true }
  );
  res.status(201).json({ saved: { stableKey, savedAt: saved.savedAt } });
});

// User's saved-to-history items, most-recent first.
router.get('/saved', async (req: Request, res: Response) => {
  const userId = req.userId!;
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const items = await SavedRecommendation.find({ userId }).sort({ savedAt: -1 }).limit(limit).lean();
  res.json({
    saved: items.map((s) => ({ ...toFrontendShape(s.item as never), savedAt: s.savedAt })),
    count: items.length,
  });
});

// Permanently dismiss an item. Removes it from saved if present and adds to
// the dismissed list so future AI generations exclude it.
router.delete('/item', async (req: Request, res: Response) => {
  const userId = req.userId!;
  const stableKey: string | undefined = req.body?.stableKey || req.query.stableKey as string | undefined;
  if (!stableKey) {
    res.status(400).json({ error: 'stableKey is required' });
    return;
  }
  await Promise.all([
    DismissedRecommendation.findOneAndUpdate(
      { userId, stableKey },
      { userId, stableKey, dismissedAt: new Date() },
      { upsert: true, new: true }
    ),
    SavedRecommendation.deleteOne({ userId, stableKey }),
    // Pull any cached spotlight rows that reference this stableKey so a fresh
    // GET doesn't immediately re-serve it from cache.
    RecommendationCache.updateMany(
      { userId },
      { $pull: { recommendations: { $or: [{ productUrl: stableKey }, { name: stableKey }] } } as never }
    ),
  ]);
  res.status(204).send();
});

export default router;
