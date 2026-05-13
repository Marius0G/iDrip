import { Router, Request, Response } from 'express';
import getStripe, { getTierFromPriceId } from '../lib/stripe';
import User from '../models/User';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: any;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  // Respond immediately so Stripe doesn't timeout
  res.json({ received: true });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId || session.client_reference_id;
        if (!userId) break;

        const user = await User.findById(userId);
        if (!user) break;

        if (session.customer) {
          user.stripeCustomerId = session.customer as string;
        }
        if (session.subscription) {
          user.stripeSubscriptionId = session.subscription as string;
        }
        if (session.mode === 'payment') {
          user.subscriptionTier = 'lifetime';
          user.subscriptionStatus = 'active';
          user.subscriptionExpiry = null;
        }
        await user.save();
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) break;

        user.stripeSubscriptionId = subscription.id;
        user.subscriptionStatus = subscription.status;
        user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);

        const priceId = subscription.items.data[0]?.price?.id;
        if (priceId) {
          user.subscriptionTier = getTierFromPriceId(priceId);
        }

        await user.save();
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await User.findOneAndUpdate(
          { stripeCustomerId: customerId },
          {
            subscriptionTier: 'free',
            subscriptionStatus: 'canceled',
            stripeSubscriptionId: '',
            generationsUsedThisMonth: 0,
          }
        );
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const customerId = invoice.customer as string;
          await User.findOneAndUpdate(
            { stripeCustomerId: customerId },
            { generationResetDate: new Date(), generationsUsedThisMonth: 0 }
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const customerId = invoice.customer as string;
          await User.findOneAndUpdate(
            { stripeCustomerId: customerId },
            { subscriptionStatus: 'past_due' }
          );
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }
});

export default router;
