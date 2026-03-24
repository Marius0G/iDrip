import User from '../models/User';
import WardrobeItem from '../models/WardrobeItem';
import Outfit from '../models/Outfit';
import { DEMO_USER, SEED_WARDROBE_ITEMS } from './data';

export async function seed(): Promise<void> {
  const existing = await User.findOne({ email: DEMO_USER.email });
  if (existing) {
    console.log('Seed data already exists, skipping...');
    return;
  }

  console.log('Seeding database...');

  const user = await User.create(DEMO_USER);

  const items = await WardrobeItem.insertMany(
    SEED_WARDROBE_ITEMS.map((item) => ({ ...item, userId: user._id }))
  );

  const tops = items.filter((i) => i.category === 'tops');
  const bottoms = items.filter((i) => i.category === 'bottoms');
  const shoes = items.filter((i) => i.category === 'shoes');

  await Outfit.create([
    {
      userId: user._id,
      name: 'Minimal Monochrome',
      items: [tops[1]._id, bottoms[0]._id, shoes[0]._id],
      occasion: 'smart-casual',
      score: 92,
      aiReasoning: 'The White Oxford Shirt paired with Black Slim Jeans creates a clean, timeless silhouette. White Leather Sneakers keep it approachable and modern.',
      savedByUser: true,
    },
    {
      userId: user._id,
      name: 'Streetwear Essentials',
      items: [tops[3]._id, bottoms[2]._id, shoes[1]._id],
      occasion: 'casual',
      score: 88,
      aiReasoning: 'The Olive Hoodie adds a pop of earth tone against the Dark Wash Denim. Black Chelsea Boots elevate the streetwear vibe with a smart edge.',
      savedByUser: true,
    },
  ]);

  console.log(`Seeded: 1 user, ${items.length} wardrobe items, 2 outfits`);
}
