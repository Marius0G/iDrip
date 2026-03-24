import type { ClothingItem } from "./wardrobe";
import type { Season } from "./wardrobe";

export type OutfitOccasion = "casual" | "work" | "formal" | "date" | "sport" | "travel";

export type OutfitSlotKey = "top" | "bottom" | "outerwear" | "shoes" | "accessory1" | "accessory2";

export interface OutfitSlotType {
  slot: OutfitSlotKey;
  label: string;
  required: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  items: OutfitItem[];
  occasion: OutfitOccasion;
  season: Season[];
  rating?: number;
  aiGenerated: boolean;
  aiReasoning?: string;
  score?: number;
  createdAt: string;
}

export interface OutfitItem {
  slot: OutfitSlotKey;
  clothingItemId: string;
  clothingItem: ClothingItem;
}

export interface OutfitGenerationRequest {
  occasion: OutfitOccasion;
  season: Season;
  includeItemIds?: string[];
  excludeItemIds?: string[];
}
