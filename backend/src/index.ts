import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { seed } from './seed/seed';
import { authMiddleware } from './middleware/auth';
import authRoutes from './routes/auth';
import wardrobeRoutes from './routes/wardrobe';
import outfitRoutes from './routes/outfits';
import recommendationRoutes from './routes/recommendations';
import userRoutes from './routes/users';
import aiRoutes from './routes/ai';
import subscriptionWebhookRoutes from './routes/subscriptionWebhook';
import subscriptionRoutes from './routes/subscriptions';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : {}));

// Stripe webhook must receive raw body before JSON parser
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }), subscriptionWebhookRoutes);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'iDrip Backend is running' });
});

app.use('/api/auth', authRoutes);

app.use('/api/wardrobe', authMiddleware, wardrobeRoutes);
app.use('/api/outfits', authMiddleware, outfitRoutes);
app.use('/api/recommendations', authMiddleware, recommendationRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
// Public plans endpoint
app.get('/api/subscriptions/plans', (_req, res) => {
  const { PRICE_IDS } = require('./lib/stripe');
  res.json({
    plans: [
      {
        id: 'free', name: 'Free', price: 0, currency: 'usd', interval: null, stripePriceId: null,
        features: ['Up to 20 wardrobe items', '5 AI outfit generations per month', 'Basic shopping recommendations'],
        highlighted: false,
      },
      {
        id: 'pro_monthly', name: 'Pro', price: 9.99, currency: 'usd', interval: 'month',
        stripePriceId: PRICE_IDS.pro_monthly,
        features: ['Unlimited wardrobe items', 'Unlimited AI outfit generations', 'Advanced shopping recommendations', 'Priority AI processing'],
        highlighted: true,
      },
      {
        id: 'pro_yearly', name: 'Pro', price: 89.99, currency: 'usd', interval: 'year',
        stripePriceId: PRICE_IDS.pro_yearly,
        features: ['Everything in Pro Monthly', '2 months free compared to monthly'],
        highlighted: false,
      },
      {
        id: 'lifetime', name: 'Lifetime', price: 199, currency: 'usd', interval: null,
        stripePriceId: PRICE_IDS.lifetime,
        features: ['Unlimited wardrobe forever', 'Unlimited AI generations forever', 'All future premium features', 'Priority support'],
        highlighted: false,
      },
    ],
  });
});

// Protected subscription routes
app.use('/api/subscriptions', authMiddleware, subscriptionRoutes);

async function start() {
  await connectDB();
  if (process.env.SKIP_SEED !== 'true') {
    await seed();
  }
  app.listen(PORT, () => {
    console.log(`iDrip Backend running on port ${PORT}`);
  });
}

start();
