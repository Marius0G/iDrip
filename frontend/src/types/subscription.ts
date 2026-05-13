export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year' | null;
  stripePriceId: string | null;
  features: string[];
  highlighted: boolean;
}

export interface CurrentSubscription {
  tier: 'free' | 'pro' | 'lifetime';
  status: string;
  expiry: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  generationsUsedThisMonth: number;
  generationsRemaining: number;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface PortalSession {
  url: string;
}
