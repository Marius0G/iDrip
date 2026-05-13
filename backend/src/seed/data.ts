export const DEMO_USER = {
  googleId: 'demo-user',
  name: 'Alex Demo',
  email: 'alex@idrip.demo',
  avatarUrl: '',
  refreshToken: '',
  preferences: {
    styles: ['streetwear', 'minimalist', 'casual'],
    favoriteColors: ['black', 'white', 'olive', 'cream'],
    budgetMin: 30,
    budgetMax: 150,
    sizes: { top: 'M', bottom: 'M', shoes: '42' },
  },
};

export const SEED_WARDROBE_ITEMS = [
  { name: 'Black Oversized Tee', category: 'tops', color: 'black', brand: 'Essential', imageUrl: 'https://placehold.co/400x500/1a1a1a/ffffff?text=Black+Oversized+Tee', seasons: ['summer', 'spring', 'fall'], tags: ['casual', 'streetwear'] },
  { name: 'White Oxford Shirt', category: 'tops', color: 'white', brand: 'COS', imageUrl: 'https://placehold.co/400x500/f5f5f5/111111?text=White+Oxford+Shirt', seasons: ['all'], tags: ['smart-casual', 'formal'] },
  { name: 'Navy Crewneck Sweater', category: 'tops', color: 'navy', brand: 'Uniqlo', imageUrl: 'https://placehold.co/400x500/1a1a3e/ffffff?text=Navy+Crewneck', seasons: ['fall', 'winter'], tags: ['casual', 'layering'] },
  { name: 'Olive Hoodie', category: 'tops', color: 'olive', brand: 'Nike', imageUrl: 'https://placehold.co/400x500/556b2f/ffffff?text=Olive+Hoodie', seasons: ['fall', 'winter'], tags: ['streetwear', 'casual'] },
  { name: 'Black Slim Jeans', category: 'bottoms', color: 'black', brand: "Levi's", imageUrl: 'https://placehold.co/400x500/111111/ffffff?text=Black+Slim+Jeans', seasons: ['all'], tags: ['casual', 'versatile'] },
  { name: 'Cream Wide-Leg Trousers', category: 'bottoms', color: 'cream', brand: 'Zara', imageUrl: 'https://placehold.co/400x500/f5f0e1/111111?text=Cream+Trousers', seasons: ['spring', 'summer'], tags: ['smart-casual', 'minimalist'] },
  { name: 'Dark Wash Denim', category: 'bottoms', color: 'indigo', brand: "Levi's", imageUrl: 'https://placehold.co/400x500/1a1a4e/ffffff?text=Dark+Wash+Denim', seasons: ['all'], tags: ['casual', 'everyday'] },
  { name: 'White Leather Sneakers', category: 'shoes', color: 'white', brand: 'Common Projects', imageUrl: 'https://placehold.co/400x500/fafafa/111111?text=White+Sneakers', seasons: ['spring', 'summer', 'fall'], tags: ['minimalist', 'versatile'] },
  { name: 'Black Chelsea Boots', category: 'shoes', color: 'black', brand: 'Dr. Martens', imageUrl: 'https://placehold.co/400x500/0a0a0a/ffffff?text=Chelsea+Boots', seasons: ['fall', 'winter'], tags: ['smart-casual', 'streetwear'] },
  { name: 'Black Denim Jacket', category: 'outerwear', color: 'black', brand: 'AllSaints', imageUrl: 'https://placehold.co/400x500/1a1a1a/ffffff?text=Denim+Jacket', seasons: ['spring', 'fall'], tags: ['streetwear', 'layering'] },
  { name: 'Cream Trench Coat', category: 'outerwear', color: 'cream', brand: 'COS', imageUrl: 'https://placehold.co/400x500/f0ead6/111111?text=Trench+Coat', seasons: ['spring', 'fall'], tags: ['smart-casual', 'minimalist'] },
  { name: 'Silver Watch', category: 'accessories', color: 'silver', brand: 'Casio', imageUrl: 'https://placehold.co/400x500/c0c0c0/111111?text=Silver+Watch', seasons: ['all'], tags: ['minimalist', 'everyday'] },
];

export const MOCK_RECOMMENDATIONS = [
  { id: 'rec-1', name: 'Grey Wool Overcoat', brand: 'COS', category: 'outerwear', price: 129, imageUrl: 'https://placehold.co/400x500/808080/ffffff?text=Wool+Overcoat', matchScore: 95, matchReason: 'Pairs perfectly with your White Oxford and Black Slim Jeans' },
  { id: 'rec-2', name: 'Beige Canvas Tote', brand: 'Everlane', category: 'accessories', price: 48, imageUrl: 'https://placehold.co/400x500/d2b48c/111111?text=Canvas+Tote', matchScore: 88, matchReason: 'Neutral tone matches your minimal wardrobe palette' },
  { id: 'rec-3', name: 'Navy Chino Shorts', brand: 'Uniqlo', category: 'bottoms', price: 35, imageUrl: 'https://placehold.co/400x500/1a1a3e/ffffff?text=Chino+Shorts', matchScore: 82, matchReason: "You're missing summer bottoms in your wardrobe" },
  { id: 'rec-4', name: 'Black Running Sneakers', brand: 'Nike', category: 'shoes', price: 110, imageUrl: 'https://placehold.co/400x500/111111/ffffff?text=Running+Sneakers', matchScore: 79, matchReason: 'Adds an athletic option to balance your casual collection' },
  { id: 'rec-5', name: 'White Linen Shirt', brand: 'Zara', category: 'tops', price: 45, imageUrl: 'https://placehold.co/400x500/fefefe/111111?text=Linen+Shirt', matchScore: 91, matchReason: 'Essential summer layering piece for your color palette' },
  { id: 'rec-6', name: 'Olive Cargo Pants', brand: 'Carhartt', category: 'bottoms', price: 89, imageUrl: 'https://placehold.co/400x500/556b2f/ffffff?text=Cargo+Pants', matchScore: 85, matchReason: 'Complements your Olive Hoodie for a tonal streetwear look' },
  { id: 'rec-7', name: 'Leather Belt Black', brand: 'AllSaints', category: 'accessories', price: 55, imageUrl: 'https://placehold.co/400x500/1a1a1a/ffffff?text=Leather+Belt', matchScore: 77, matchReason: 'Ties together your black pieces with a polished detail' },
  { id: 'rec-8', name: 'Cream Knit Polo', brand: 'COS', category: 'tops', price: 69, imageUrl: 'https://placehold.co/400x500/f5f0e1/111111?text=Knit+Polo', matchScore: 90, matchReason: 'Bridges casual and smart-casual in your preferred cream tone' },
];

export const REASONING_TEMPLATES = [
  'The {top} paired with {bottom} creates a balanced silhouette. {shoes} ground the look with the right level of formality for a {occasion} setting.',
  'This outfit leverages your {topColor} and {bottomColor} palette for a cohesive, intentional feel. The {shoes} add a finishing touch that pulls everything together.',
  'A {occasion}-ready combination: the {top} brings structure while the {bottom} keeps things relaxed. {shoes} bridge the gap between casual and polished.',
  'Clean and effortless — the {top} works as a versatile base, while the {bottom} adds visual weight. Finished with {shoes} for a pulled-together {occasion} look.',
  'This pairing plays with proportion: the {top} keeps the upper body streamlined, and the {bottom} adds just the right amount of volume. {shoes} anchor the outfit.',
];
