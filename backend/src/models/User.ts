import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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
