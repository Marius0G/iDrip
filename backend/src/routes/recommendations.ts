import { Router, Request, Response } from 'express';
import { MOCK_RECOMMENDATIONS } from '../seed/data';
import { generateRecommendationsAI } from '../services/aiRecommendationService';
import WardrobeItem from '../models/WardrobeItem';
import User from '../models/User';
import RecommendationCache from '../models/RecommendationCache';

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
        // Upsert: a parallel request may have populated the same key already.
        await RecommendationCache.findOneAndUpdate(
          { userId, cacheKey },
          {
            userId,
            cacheKey,
            recommendations: aiRecs,
            expiresAt: new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000),
          },
          { upsert: true, new: true }
        );
        res.json({
          recommendations: aiRecs.map(toFrontendShape),
          count: aiRecs.length,
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

export default router;
