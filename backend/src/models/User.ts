import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  avatarUrl: string;
  refreshToken: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  subscriptionTier: 'free' | 'pro' | 'lifetime';
  subscriptionStatus: string;
  subscriptionExpiry: Date | null;
  generationsUsedThisMonth: number;
  generationResetDate: Date | null;
  preferences: {
    styles: string[];
    favoriteColors: string[];
    budgetMin: number;
    budgetMax: number;
    sizes: {
      top: string;
      bottom: string;
      shoes: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    stripeCustomerId: { type: String, default: '' },
    stripeSubscriptionId: { type: String, default: '' },
    subscriptionTier: { type: String, enum: ['free', 'pro', 'lifetime'], default: 'free' },
    subscriptionStatus: { type: String, default: '' },
    subscriptionExpiry: { type: Date, default: null },
    generationsUsedThisMonth: { type: Number, default: 0 },
    generationResetDate: { type: Date, default: null },
    preferences: {
      styles: { type: [String], default: [] },
      favoriteColors: { type: [String], default: [] },
      budgetMin: { type: Number, default: 0 },
      budgetMax: { type: Number, default: 200 },
      sizes: {
        top: { type: String, default: 'M' },
        bottom: { type: String, default: 'M' },
        shoes: { type: String, default: '42' },
      },
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
