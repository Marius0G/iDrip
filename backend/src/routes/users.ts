import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

router.get('/me', async (_req: Request, res: Response) => {
  const user = await User.findOne({ email: 'alex@idrip.demo' });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json(user);
});

router.put('/me/preferences', async (req: Request, res: Response) => {
  const user = await User.findOneAndUpdate(
    { email: 'alex@idrip.demo' },
    { $set: { preferences: req.body } },
    { new: true, runValidators: true }
  );
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json(user);
});

export default router;
