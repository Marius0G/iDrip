import { Schema, model, Document, Types } from 'mongoose';

export type Category = 'tops' | 'bottoms' | 'shoes' | 'outerwear' | 'accessories';
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all';

export interface IWardrobeItem extends Document {
  userId: Types.ObjectId;
  name: string;
  category: Category;
  color: string;
  brand: string;
  imageUrl: string;
  seasons: Season[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const wardrobeItemSchema = new Schema<IWardrobeItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'], required: true },
    color: { type: String, required: true },
    brand: { type: String, default: '' },
    imageUrl: { type: String, default: 'https://placehold.co/400x500/111/fff?text=Clothing' },
    seasons: { type: [String], enum: ['spring', 'summer', 'fall', 'winter', 'all'], default: ['all'] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IWardrobeItem>('WardrobeItem', wardrobeItemSchema);
