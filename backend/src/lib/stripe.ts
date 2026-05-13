import Stripe from 'stripe';

let _stripe: any = null;

function getStripe(): any {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2025-03-31.webhook' as any,
    });
  }
  return _stripe;
}

const PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY || '';
const PRICE_PRO_YEARLY = process.env.STRIPE_PRICE_PRO_YEARLY || '';
const PRICE_LIFETIME = process.env.STRIPE_PRICE_LIFETIME || '';

export function getTierFromPriceId(priceId: string): 'pro' | 'lifetime' {
  if (priceId === PRICE_LIFETIME) return 'lifetime';
  return 'pro';
}

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY);
}

export const PRICE_IDS = {
  pro_monthly: PRICE_PRO_MONTHLY,
  pro_yearly: PRICE_PRO_YEARLY,
  lifetime: PRICE_LIFETIME,
};

export default getStripe;
