import { Schema, model, Document, Types } from 'mongoose';

export interface IOutfit extends Document {
  userId: Types.ObjectId;
  name: string;
  items: Types.ObjectId[];
  occasion: string;
  score: number;
  aiReasoning: string;
  savedByUser: boolean;
  tags: string[];
  collectionName: string;
  colorScheme: string[];
  weatherScore: number | null;
  styleScore: number | null;
  feedback: string;
  createdAt: Date;
}

const outfitSchema = new Schema<IOutfit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'WardrobeItem' }],
    occasion: { type: String, default: 'everyday' },
    score: { type: Number, default: 85 },
    aiReasoning: { type: String, default: '' },
    savedByUser: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    collectionName: { type: String, default: '' },
    colorScheme: { type: [String], default: [] },
    weatherScore: { type: Number, default: null },
    styleScore: { type: Number, default: null },
    feedback: { type: String, default: '' },
  },
  { timestamps: true }
);

export default model<IOutfit>('Outfit', outfitSchema);
