import { Schema, model, Document, Types } from 'mongoose';

export interface IDismissedRecommendation extends Document {
  userId: Types.ObjectId;
  stableKey: string;
  dismissedAt: Date;
}

const schema = new Schema<IDismissedRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stableKey: { type: String, required: true },
    dismissedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

schema.index({ userId: 1, stableKey: 1 }, { unique: true });

export default model<IDismissedRecommendation>('DismissedRecommendation', schema);
