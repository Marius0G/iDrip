import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import WardrobeItem from '../models/WardrobeItem';

export async function checkWardrobeLimit(req: Request, res: Response, next: NextFunction) {
  const user = await User.findById(req.userId);
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  if (user.subscriptionTier === 'free') {
    const count = await WardrobeItem.countDocuments({ userId: req.userId });
    if (count >= 20) {
      res.status(403).json({
        error: 'Wardrobe limit reached',
        code: 'WARDROBE_LIMIT_REACHED',
        message: 'Free plan limited to 20 wardrobe items. Upgrade to Pro for unlimited storage.',
        limit: 20,
        current: count,
      });
      return;
    }
  }

  next();
}

export async function checkGenerationLimit(req: Request, res: Response, next: NextFunction) {
  const user = await User.findById(req.userId);
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  if (user.subscriptionTier === 'free') {
    const now = new Date();
    if (user.generationResetDate) {
      const lastReset = new Date(user.generationResetDate);
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        user.generationsUsedThisMonth = 0;
        user.generationResetDate = now;
        await user.save();
      }
    }

    if ((user.generationsUsedThisMonth || 0) >= 5) {
      res.status(403).json({
        error: 'Generation limit reached',
        code: 'GENERATION_LIMIT_REACHED',
        message: 'Free plan limited to 5 AI generations per month. Upgrade to Pro for unlimited.',
        limit: 5,
        current: user.generationsUsedThisMonth,
      });
      return;
    }
  }

  next();
}

export async function incrementGenerationCount(userId: string) {
  const user = await User.findById(userId);
  if (user && user.subscriptionTier === 'free') {
    user.generationsUsedThisMonth = (user.generationsUsedThisMonth || 0) + 1;
    if (!user.generationResetDate) {
      user.generationResetDate = new Date();
    }
    await user.save();
  }
}
