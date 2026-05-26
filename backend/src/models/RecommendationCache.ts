import { Schema, model, Document, Types } from 'mongoose';

export interface IRecommendation {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  matchScore: number;
  matchReason: string;
  description?: string;
  tags?: string[];
  productUrl?: string;
}

export interface IRecommendationCache extends Document {
  userId: Types.ObjectId;
  cacheKey: string;
  recommendations: IRecommendation[];
  expiresAt: Date;
  createdAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
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

const cacheSchema = new Schema<IRecommendationCache>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cacheKey: { type: String, required: true },
    recommendations: { type: [recommendationSchema], default: [] },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

cacheSchema.index({ userId: 1, cacheKey: 1 }, { unique: true });
// TTL — Mongo auto-deletes when expiresAt is past
cacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IRecommendationCache>('RecommendationCache', cacheSchema);
