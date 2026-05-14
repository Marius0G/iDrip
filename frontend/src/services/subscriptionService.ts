import { api } from '@/lib/api';
import type { Plan, CurrentSubscription, CheckoutSession, PortalSession } from '@/types/subscription';

export const subscriptionService = {
  getPlans(): Promise<{ plans: Plan[] }> {
    return api.get('/subscriptions/plans');
  },

  getCurrent(): Promise<CurrentSubscription> {
    return api.get('/subscriptions/current');
  },

  createCheckoutSession(priceId: string): Promise<CheckoutSession> {
    return api.post('/subscriptions/create-checkout-session', { priceId });
  },

  createPortalSession(): Promise<PortalSession> {
    return api.post('/subscriptions/create-portal-session');
  },

  cancel(): Promise<{ message: string }> {
    return api.post('/subscriptions/cancel');
  },

  mockUpgrade(tier: 'pro' | 'lifetime'): Promise<{ tier: string; status: string; message: string }> {
    return api.post('/subscriptions/mock-upgrade', { tier });
  },
};
