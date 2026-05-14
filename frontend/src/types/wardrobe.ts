export type ClothingCategory = "tops" | "bottoms" | "outerwear" | "dresses" | "shoes" | "accessories";

export type ClothingColor = "black" | "white" | "gray" | "navy" | "blue" | "red" | "green" | "brown" | "beige" | "pink" | "olive" | "cream" | "other";

export type Season = "spring" | "summer" | "fall" | "winter" | "all";

// Core AI fields shared by all categories
interface ClothingCore {
  subcategory: string;
  primaryColor: string;
  secondaryColors: string[];
  colorTemperature: string;
  colorIntensity: string;
  pattern: string;
  material: string;
  texture: string;
  transparency: string;
  printType: string;
  gender: string;
  formality: number | null;
  occasion: string[];
  style: string[];
  aiConfidence: number | null;
  aiAnalysis: Record<string, unknown>;
}

// Category-conditional fields
interface ClothingConditional {
  fit: string;
  sleeveLength: string;
  sleeveStyle: string;
  neckline: string;
  collarType: string;
  cuffStyle: string;
  length: string;
  hemStyle: string;
  closureType: string;
  backDetail: string;
  strapStyle: string;
  rise: string;
  pleatStyle: string;
  distressing: string;
  waistbandStyle: string;
  legOpening: string;
  warmthLevel: string;
  waterResistance: string;
  hood: string;
  pockets: string;
  silhouette: string;
  heelHeight: string;
  heelStyle: string;
  toeStyle: string;
  soleType: string;
  shaftHeight: string;
  accessoryType: string;
  bandWidth: string;
  sockHeight: string;
  necklaceLength: string;
  hatStyle: string;
  earringStyle: string;
  tieStyle: string;
  watchStyle: string;
  lensColor: string;
  lining: string;
  publicId: string;
}

export interface ClothingItem extends ClothingCore, ClothingConditional {
  id: string;
  name: string;
  category: ClothingCategory;
  color: ClothingColor;
  tags: string[];
  imageUrl: string;
  season: Season[];
  brand?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClothingItemInput = Omit<ClothingItem, "id" | "createdAt" | "updatedAt">;

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
