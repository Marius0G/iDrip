import { Router, Request, Response } from 'express';
import Outfit from '../models/Outfit';
import WardrobeItem from '../models/WardrobeItem';
import User from '../models/User';
import { REASONING_TEMPLATES } from '../seed/data';

const router = Router();

async function getDemoUserId(): Promise<string> {
  const user = await User.findOne({ email: 'alex@idrip.demo' });
  return user!._id.toString();
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

router.post('/generate', async (req: Request, res: Response) => {
  const userId = await getDemoUserId();
  const { occasion = 'everyday', season } = req.body;

  const filter: Record<string, unknown> = { userId };
  if (season && season !== 'all') {
    filter.$or = [{ seasons: season }, { seasons: 'all' }];
  }

  const items = await WardrobeItem.find(filter);
  const tops = items.filter((i) => i.category === 'tops');
  const bottoms = items.filter((i) => i.category === 'bottoms');
  const shoes = items.filter((i) => i.category === 'shoes');
  const outerwear = items.filter((i) => i.category === 'outerwear');
  const accessories = items.filter((i) => i.category === 'accessories');

  if (!tops.length || !bottoms.length || !shoes.length) {
    res.status(400).json({ error: 'Not enough wardrobe items to generate an outfit. Need at least 1 top, 1 bottom, and 1 pair of shoes.' });
    return;
  }

  const top = pickRandom(tops);
  const bottom = pickRandom(bottoms);
  const shoe = pickRandom(shoes);
  const selectedItems = [top, bottom, shoe];

  if (outerwear.length && Math.random() > 0.5) selectedItems.push(pickRandom(outerwear));
  if (accessories.length && Math.random() > 0.7) selectedItems.push(pickRandom(accessories));

  const score = Math.floor(Math.random() * 24) + 75;
  const template = pickRandom(REASONING_TEMPLATES);
  const reasoning = template
    .replace('{top}', top.name)
    .replace('{bottom}', bottom.name)
    .replace('{shoes}', shoe.name)
    .replace('{topColor}', top.color)
    .replace('{bottomColor}', bottom.color)
    .replace('{occasion}', occasion);

  const count = await Outfit.countDocuments({ userId });
  const name = `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Look #${count + 1}`;

  const outfit = await Outfit.create({
    userId,
    name,
    items: selectedItems.map((i) => i._id),
    occasion,
    score,
    aiReasoning: reasoning,
    savedByUser: false,
  });

  const populated = await outfit.populate('items');
  res.status(201).json({ outfit: populated });
});

router.get('/', async (req: Request, res: Response) => {
  const userId = await getDemoUserId();
  const { occasion } = req.query;

  const filter: Record<string, unknown> = { userId };
  if (occasion) filter.occasion = occasion;

  const outfits = await Outfit.find(filter).populate('items').sort({ createdAt: -1 });
  res.json({ outfits, count: outfits.length });
});

router.get('/:id', async (req: Request, res: Response) => {
  const outfit = await Outfit.findById(req.params.id).populate('items');
  if (!outfit) { res.status(404).json({ error: 'Outfit not found' }); return; }
  res.json(outfit);
});

router.patch('/:id/save', async (req: Request, res: Response) => {
  const outfit = await Outfit.findById(req.params.id);
  if (!outfit) { res.status(404).json({ error: 'Outfit not found' }); return; }
  outfit.savedByUser = !outfit.savedByUser;
  await outfit.save();
  res.json(outfit);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const outfit = await Outfit.findByIdAndDelete(req.params.id);
  if (!outfit) { res.status(404).json({ error: 'Outfit not found' }); return; }
  res.status(204).send();
});

export default router;
