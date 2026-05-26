import { Schema, model, Document, Types } from 'mongoose';
import type { IRecommendation } from './RecommendationCache';

export interface IDismissedRecommendation extends Document {
  userId: Types.ObjectId;
  stableKey: string;
  // Snapshot of the item so the Hidden tab can render it without needing the
  // original spotlight/saved record (which may be gone).
  item?: IRecommendation;
  // false = hidden (user can restore it from the Hidden tab),
  // true  = deleted forever (never shown in any UI; AI still filters it out).
  permanent: boolean;
  dismissedAt: Date;
}

const itemSchema = new Schema(
  {
    id: String,
    name: String,
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

const schema = new Schema<IDismissedRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stableKey: { type: String, required: true },
    item: { type: itemSchema },
    permanent: { type: Boolean, default: true },
    dismissedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

schema.index({ userId: 1, stableKey: 1 }, { unique: true });

export default model<IDismissedRecommendation>('DismissedRecommendation', schema);
