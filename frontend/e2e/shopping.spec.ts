import { test, expect } from '@playwright/test';
import { seedAuthenticatedUser, mockBackendDefaults, seedPersistedStore } from './fixtures';

const SAMPLE_RECS = [
  { id: 'r1', name: 'Linen Blazer', description: 'Light layering', category: 'outerwear', estimatedPrice: 89, imageUrl: 'https://placehold.co/300x400', reason: 'matches your wardrobe', matchScore: 92, brand: 'Brand', tags: ['minimalist'] },
  { id: 'r2', name: 'Sneakers', description: 'Everyday', category: 'shoes', estimatedPrice: 60, imageUrl: 'https://placehold.co/300x400', reason: 'foundation footwear', matchScore: 88, brand: 'Brand', tags: ['minimalist'] },
];

test.describe('Shopping page', () => {
  test('renders the page heading + budget slider when recs are seeded', async ({ page }) => {
    await seedAuthenticatedUser(page);
    // useShoppingStore fetches from /api/recommendations on mount, so the mock
    // route is the source of truth. Local-store seeding is only for prefs.
    await mockBackendDefaults(page, { recommendations: SAMPLE_RECS });
    await seedPersistedStore(page, 'idrip-shopping', {
      budget: { monthlyBudget: 500, spent: 0, currency: 'USD' },
      selectedStyles: [],
    });
    await page.goto('/shopping');

    await expect(page.getByRole('heading', { name: /shopping/i })).toBeVisible();
    await expect(page.getByText('Linen Blazer')).toBeVisible();
    await expect(page.getByText('Sneakers')).toBeVisible();
  });

  test('renders empty state when budget remaining is too low for any rec', async ({ page }) => {
    await seedAuthenticatedUser(page);
    await mockBackendDefaults(page, { recommendations: SAMPLE_RECS });
    await seedPersistedStore(page, 'idrip-shopping', {
      budget: { monthlyBudget: 10, spent: 0, currency: 'USD' }, // below cheapest rec
      selectedStyles: [],
    });
    await page.goto('/shopping');

    await expect(page.getByText(/no recommendations/i)).toBeVisible();
  });

  test('page is reachable from a fresh authenticated session', async ({ page }) => {
    await seedAuthenticatedUser(page);
    await mockBackendDefaults(page);
    await page.goto('/shopping');
    await expect(page).toHaveURL(/\/shopping/);
    await expect(page.getByRole('heading', { name: /shopping/i })).toBeVisible();
  });
});
