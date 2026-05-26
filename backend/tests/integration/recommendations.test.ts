import { describe, expect, it, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Stub the ai-service HTTP client — we test the route's orchestration, not the LLM
const aiMock = vi.fn();
vi.mock('../../src/services/aiRecommendationService', () => ({
  generateRecommendationsAI: (...args: unknown[]) => aiMock(...args),
}));

import { createApp } from '../../src/app';
import WardrobeItem from '../../src/models/WardrobeItem';
import RecommendationCache from '../../src/models/RecommendationCache';
import { authHeader, createTestUser } from '../helpers';

const SAMPLE_AI_RECS = [
  {
    id: 'rec-1',
    name: 'White Linen Shirt',
    brand: 'Uniqlo',
    category: 'tops',
    price: 40,
    imageUrl: 'https://example.com/shirt.jpg',
    matchScore: 92,
    matchReason: 'Pairs with your black slim jeans',
    description: 'A breathable linen shirt for summer',
    tags: ['minimalist', 'summer'],
    productUrl: 'https://uniqlo.com/shirt',
  },
];

describe('GET /api/recommendations', () => {
  const originalAiUrl = process.env.AI_SERVICE_URL;
  const app = createApp();

  beforeEach(() => {
    aiMock.mockReset();
  });

  describe('when AI_SERVICE_URL is set (AI mode)', () => {
    beforeEach(() => {
      process.env.AI_SERVICE_URL = 'http://test-ai:8000';
    });

    it('calls the AI service on cache miss and stores result', async () => {
      const user = await createTestUser();
      await WardrobeItem.create({ userId: user._id, name: 'White Oxford', category: 'tops' });
      aiMock.mockResolvedValueOnce(SAMPLE_AI_RECS);

      const res = await request(app)
        .get('/api/recommendations?budget=100&style=minimalist')
        .set(authHeader(user));

      expect(res.status).toBe(200);
      expect(aiMock).toHaveBeenCalledTimes(1);
      expect(res.body.cached).toBe(false);
      expect(res.body.recommendations).toHaveLength(1);
      expect(res.body.recommendations[0]).toMatchObject({
        id: 'rec-1',
        estimatedPrice: 40,
        reason: 'Pairs with your black slim jeans',
        productUrl: 'https://uniqlo.com/shirt',
      });

      const cached = await RecommendationCache.findOne({ userId: user._id });
      expect(cached).toBeTruthy();
      expect(cached?.recommendations).toHaveLength(1);
    });

    it('returns cached result on second call with same wardrobe', async () => {
      const user = await createTestUser();
      await WardrobeItem.create({ userId: user._id, name: 'White Oxford', category: 'tops' });
      aiMock.mockResolvedValueOnce(SAMPLE_AI_RECS);

      const first = await request(app).get('/api/recommendations?budget=100&style=minimalist').set(authHeader(user));
      expect(first.body.cached).toBe(false);

      const second = await request(app).get('/api/recommendations?budget=100&style=minimalist').set(authHeader(user));
      expect(second.status).toBe(200);
      expect(second.body.cached).toBe(true);
      expect(aiMock).toHaveBeenCalledTimes(1); // not called again
    });

    it('busts cache when wardrobe changes (new item)', async () => {
      const user = await createTestUser();
      await WardrobeItem.create({ userId: user._id, name: 'White Oxford', category: 'tops' });
      aiMock.mockResolvedValue(SAMPLE_AI_RECS);

      const first = await request(app).get('/api/recommendations?style=minimalist').set(authHeader(user));
      expect(first.body.cached).toBe(false);

      // User uploads a new wardrobe item → fingerprint changes
      await WardrobeItem.create({ userId: user._id, name: 'Black Jeans', category: 'bottoms' });

      const second = await request(app).get('/api/recommendations?style=minimalist').set(authHeader(user));
      expect(second.body.cached).toBe(false);
      expect(aiMock).toHaveBeenCalledTimes(2); // called again for fresh recs
    });

    it('busts cache when wardrobe item is edited (updatedAt advances)', async () => {
      const user = await createTestUser();
      const item = await WardrobeItem.create({ userId: user._id, name: 'White Oxford', category: 'tops' });
      aiMock.mockResolvedValue(SAMPLE_AI_RECS);

      await request(app).get('/api/recommendations?style=minimalist').set(authHeader(user));

      // Force a clearly different timestamp (mongoose sets updatedAt at second granularity sometimes)
      await WardrobeItem.findByIdAndUpdate(item._id, {
        name: 'Renamed Oxford',
        updatedAt: new Date(Date.now() + 60_000),
      });

      const second = await request(app).get('/api/recommendations?style=minimalist').set(authHeader(user));
      expect(second.body.cached).toBe(false);
      expect(aiMock).toHaveBeenCalledTimes(2);
    });

    it('different users get separate caches', async () => {
      const userA = await createTestUser({ email: 'a@test.local', googleId: 'gid-a' });
      const userB = await createTestUser({ email: 'b@test.local', googleId: 'gid-b' });
      await WardrobeItem.create({ userId: userA._id, name: 'A item', category: 'tops' });
      await WardrobeItem.create({ userId: userB._id, name: 'B item', category: 'tops' });
      aiMock.mockResolvedValue(SAMPLE_AI_RECS);

      await request(app).get('/api/recommendations').set(authHeader(userA));
      await request(app).get('/api/recommendations').set(authHeader(userB));

      expect(aiMock).toHaveBeenCalledTimes(2);
      const caches = await RecommendationCache.find({});
      expect(caches).toHaveLength(2);
      expect(caches.map((c) => c.userId.toString()).sort()).toEqual([
        userA._id.toString(),
        userB._id.toString(),
      ].sort());
    });

    it('falls back to mocks if AI service throws', async () => {
      const user = await createTestUser();
      await WardrobeItem.create({ userId: user._id, name: 'White Oxford', category: 'tops' });
      aiMock.mockRejectedValueOnce(new Error('AI down'));

      const res = await request(app).get('/api/recommendations').set(authHeader(user));

      expect(res.status).toBe(200);
      expect(res.body.recommendations.length).toBeGreaterThan(0);
      // mock data uses these brands — confirms we hit the mock fallback
      expect(res.body.recommendations[0]).toHaveProperty('brand');

      // Failed AI call should NOT have populated cache
      const cached = await RecommendationCache.findOne({ userId: user._id });
      expect(cached).toBeNull();
    });

    it('falls back to mocks if AI returns empty', async () => {
      const user = await createTestUser();
      await WardrobeItem.create({ userId: user._id, name: 'tops', category: 'tops' });
      aiMock.mockResolvedValueOnce([]);

      const res = await request(app).get('/api/recommendations').set(authHeader(user));
      expect(res.status).toBe(200);
      expect(res.body.recommendations.length).toBeGreaterThan(0);
    });

    it('buckets budget so small slider tweaks hit cache', async () => {
      const user = await createTestUser();
      await WardrobeItem.create({ userId: user._id, name: 'top', category: 'tops' });
      aiMock.mockResolvedValueOnce(SAMPLE_AI_RECS);

      const r1 = await request(app).get('/api/recommendations?budget=148').set(authHeader(user));
      expect(r1.body.cached).toBe(false);

      // Budget 152 → rounds to same 150 bucket
      const r2 = await request(app).get('/api/recommendations?budget=152').set(authHeader(user));
      expect(r2.body.cached).toBe(true);
      expect(aiMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when AI_SERVICE_URL is unset (mock mode)', () => {
    beforeEach(() => {
      delete process.env.AI_SERVICE_URL;
    });

    it('serves mock recommendations without calling AI', async () => {
      const user = await createTestUser();

      const res = await request(app).get('/api/recommendations?budget=100').set(authHeader(user));

      expect(res.status).toBe(200);
      expect(aiMock).not.toHaveBeenCalled();
      expect(res.body.recommendations.length).toBeGreaterThan(0);
      // All mocks are under the $100 budget filter
      for (const r of res.body.recommendations) {
        expect(r.estimatedPrice).toBeLessThanOrEqual(100);
      }
    });

    it('emits frontend-shape fields even from mocks', async () => {
      const user = await createTestUser();
      const res = await request(app).get('/api/recommendations').set(authHeader(user));
      expect(res.status).toBe(200);
      const first = res.body.recommendations[0];
      expect(first).toHaveProperty('estimatedPrice');
      expect(first).toHaveProperty('reason');
      expect(first).toHaveProperty('description');
      expect(first).toHaveProperty('tags');
    });
  });

  describe('auth', () => {
    beforeEach(() => {
      delete process.env.AI_SERVICE_URL;
    });

    it('rejects unauthenticated request', async () => {
      const res = await request(app).get('/api/recommendations');
      expect(res.status).toBe(401);
    });
  });

  // Restore original env after the suite
  it('cleanup AI_SERVICE_URL', () => {
    process.env.AI_SERVICE_URL = originalAiUrl;
    if (!originalAiUrl) delete process.env.AI_SERVICE_URL;
  });
});
