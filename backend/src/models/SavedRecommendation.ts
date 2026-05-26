import { Schema, model, Document, Types } from 'mongoose';
import type { IRecommendation } from './RecommendationCache';

export interface ISavedRecommendation extends Document {
  userId: Types.ObjectId;
  stableKey: string;
  item: IRecommendation;
  savedAt: Date;
}

const itemSchema = new Schema<IRecommendation>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    brand: String,
    category: String,
    price: Number,
    imageUrl: String,
    matchScore: Number,
    matchReason: String,
    description: String,
    tags: [String],
    productUrl: String,
  },
  { _id: false }
);

const schema = new Schema<ISavedRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stableKey: { type: String, required: true },
    item: { type: itemSchema, required: true },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

schema.index({ userId: 1, stableKey: 1 }, { unique: true });
schema.index({ userId: 1, savedAt: -1 });

export default model<ISavedRecommendation>('SavedRecommendation', schema);
