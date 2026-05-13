import { Router, Request, Response } from 'express';
import WardrobeItem from '../models/WardrobeItem';
import { checkWardrobeLimit } from '../middleware/featureGate';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const userId = req.userId;
  const { category, season } = req.query;

  const filter: Record<string, unknown> = { userId };
  if (category && category !== 'all') filter.category = category;
  if (season && season !== 'all') filter.seasons = season;

  const items = await WardrobeItem.find(filter).sort({ createdAt: -1 });
  res.json({ items, count: items.length });
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await WardrobeItem.findById(req.params.id);
  if (!item) { res.status(404).json({ error: 'Item not found' }); return; }
  res.json(item);
});

router.post('/', checkWardrobeLimit, async (req: Request, res: Response) => {
  const userId = req.userId;
  const item = await WardrobeItem.create({ ...req.body, userId });
  res.status(201).json(item);
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await WardrobeItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) { res.status(404).json({ error: 'Item not found' }); return; }
  res.json(item);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const item = await WardrobeItem.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404).json({ error: 'Item not found' }); return; }
  res.status(204).send();
});

export default router;
