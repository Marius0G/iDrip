import type { ClothingCategory } from "./wardrobe";

export interface ShoppingRecommendation {
  id: string;
  name: string;
  description: string;
  category: ClothingCategory;
  estimatedPrice: number;
  imageUrl: string;
  reason: string;
  matchScore: number;
  brand: string;
  tags: string[];
}

export interface BudgetSettings {
  monthlyBudget: number;
  spent: number;
  currency: string;
}

export type StylePreference = "casual" | "formal" | "streetwear" | "minimalist" | "bohemian" | "sporty" | "vintage" | "preppy";
