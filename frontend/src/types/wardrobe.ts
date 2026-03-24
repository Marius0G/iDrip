export type ClothingCategory = "tops" | "bottoms" | "outerwear" | "dresses" | "shoes" | "accessories";

export type ClothingColor = "black" | "white" | "gray" | "navy" | "blue" | "red" | "green" | "brown" | "beige" | "pink" | "olive" | "cream" | "other";

export type Season = "spring" | "summer" | "fall" | "winter" | "all";

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  subcategory: string;
  color: ClothingColor;
  tags: string[];
  imageUrl: string;
  season: Season[];
  brand?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WardrobeFilters {
  category: ClothingCategory | "all";
  color: ClothingColor | "all";
  season: Season | "all";
  searchQuery: string;
  tags: string[];
}

export interface WardrobeStats {
  totalItems: number;
  byCategory: Record<ClothingCategory, number>;
  recentlyAdded: number;
}
