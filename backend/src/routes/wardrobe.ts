import { Router, Request, Response } from 'express';
import WardrobeItem from '../models/WardrobeItem';
import { checkWardrobeLimit } from '../middleware/featureGate';
import { handleUpload } from '../middleware/upload';
import { uploadImage } from '../services/cloudinaryService';
import { buildItemText, generateEmbedding } from '../services/embeddingService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const userId = req.userId;
  const { category, season } = req.query;

  const filter: Record<string, unknown> = { userId };
  if (category && category !== 'all') filter.category = category;
  if (season && season !== 'all') filter.season = season;

  const items = await WardrobeItem.find(filter).sort({ createdAt: -1 });
  res.json({ items, count: items.length });
});

router.get('/:id', async (req: Request, res: Response) => {
  const item = await WardrobeItem.findById(req.params.id);
  if (!item) { res.status(404).json({ error: 'Item not found' }); return; }
  res.json(item);
});

router.post('/upload-image', handleUpload, async (req: Request, res: Response) => {
  console.log('[upload-image] Received request');

  if (!req.file) {
    console.log('[upload-image] ERROR: No file in request');
    res.status(400).json({ error: 'No image file provided' });
    return;
  }

  console.log(`[upload-image] File received: ${req.file.originalname} (${req.file.size} bytes, ${req.file.mimetype})`);

  try {
    console.log('[upload-image] Uploading to Cloudinary...');
    const result = await uploadImage(req.file.buffer, req.file.originalname);
    console.log(`[upload-image] SUCCESS: ${result.url}`);
    res.json({ imageUrl: result.url, publicId: result.publicId });
  } catch (err: any) {
    console.error('[upload-image] Cloudinary error:', err.message);
    res.status(500).json({ error: `Upload failed: ${err.message}` });
  }
});

async function generateAndStoreEmbedding(itemId: string, itemData: Record<string, unknown>): Promise<void> {
  try {
    const text = buildItemText(itemData);
    if (!text) return;
    const embedding = await generateEmbedding(text);
    await WardrobeItem.findByIdAndUpdate(itemId, { embedding });
    console.log(`[wardrobe] Embedding generated for item ${itemId}`);
  } catch (err: any) {
    console.warn(`[wardrobe] Failed to generate embedding for ${itemId}: ${err.message}`);
  }
}

router.post('/', checkWardrobeLimit, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const item = await WardrobeItem.create({ ...req.body, userId });

    // Generate embedding asynchronously (don't block the response)
    const itemData = item.toObject() as unknown as Record<string, unknown>;
    generateAndStoreEmbedding(item._id.toString(), itemData);

    res.status(201).json(item);
  } catch (err: any) {
    console.error('[wardrobe] POST error:', err.message);
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: `Validation failed: ${err.message}` });
      return;
    }
    res.status(500).json({ error: `Failed to save item: ${err.message}` });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const item = await WardrobeItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) { res.status(404).json({ error: 'Item not found' }); return; }

  // Regenerate embedding if AI fields were updated
  const itemData = item.toObject() as unknown as Record<string, unknown>;
  generateAndStoreEmbedding(item._id.toString(), itemData);

  res.json(item);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const item = await WardrobeItem.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404).json({ error: 'Item not found' }); return; }
  res.status(204).send();
});

export default router;
