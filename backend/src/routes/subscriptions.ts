import { Router, Request, Response } from 'express';
import getStripe, { PRICE_IDS, isStripeConfigured } from '../lib/stripe';
import User from '../models/User';

const router = Router();

router.get('/plans', (_req: Request, res: Response) => {
  res.json({
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'usd',
        interval: null,
        stripePriceId: null,
        features: [
          'Up to 20 wardrobe items',
          '5 AI outfit generations per month',
          'Basic shopping recommendations',
        ],
        highlighted: false,
      },
      {
        id: 'pro_monthly',
        name: 'Pro',
        price: 9.99,
        currency: 'usd',
        interval: 'month',
        stripePriceId: PRICE_IDS.pro_monthly,
        features: [
          'Unlimited wardrobe items',
          'Unlimited AI outfit generations',
          'Advanced shopping recommendations',
          'Priority AI processing',
        ],
        highlighted: true,
      },
      {
        id: 'pro_yearly',
        name: 'Pro',
        price: 89.99,
        currency: 'usd',
        interval: 'year',
        stripePriceId: PRICE_IDS.pro_yearly,
        features: [
          'Everything in Pro Monthly',
          '2 months free compared to monthly',
        ],
        highlighted: false,
      },
      {
        id: 'lifetime',
        name: 'Lifetime',
        price: 199,
        currency: 'usd',
        interval: null,
        stripePriceId: PRICE_IDS.lifetime,
        features: [
          'Unlimited wardrobe forever',
          'Unlimited AI generations forever',
          'All future premium features',
          'Priority support',
        ],
        highlighted: false,
      },
    ],
  });
});

router.get('/current', async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  const isPaid = user.subscriptionTier !== 'free';
  const generationsRemaining = isPaid ? -1 : Math.max(0, 5 - (user.generationsUsedThisMonth || 0));

  res.json({
    tier: user.subscriptionTier,
    status: user.subscriptionStatus,
    expiry: user.subscriptionExpiry?.toISOString() || null,
    stripeCustomerId: user.stripeCustomerId,
    stripeSubscriptionId: user.stripeSubscriptionId,
    generationsUsedThisMonth: user.generationsUsedThisMonth,
    generationsRemaining,
  });
});

router.post('/create-checkout-session', async (req: Request, res: Response) => {
  const { priceId } = req.body;

  if (!priceId) {
    res.status(400).json({ error: 'priceId is required' });
    return;
  }

  const user = await User.findById(req.userId);
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  if (!isStripeConfigured()) {
    res.status(503).json({ error: 'Payment service is not configured' });
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user._id.toString() },
    });
    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  const isLifetime = priceId === PRICE_IDS.lifetime;

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: isLifetime ? 'payment' : 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${frontendUrl}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/subscription?canceled=true`,
    client_reference_id: user._id.toString(),
    metadata: { userId: user._id.toString() },
    ...(isLifetime ? {} : { subscription_data: { metadata: { userId: user._id.toString() } } }),
  });

  res.json({ sessionId: session.id, url: session.url });
});

router.post('/create-portal-session', async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  if (!user.stripeCustomerId) {
    res.status(400).json({ error: 'No Stripe customer found' });
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${frontendUrl}/subscription`,
  });

  res.json({ url: session.url });
});

export default router;
