import { api } from "@/lib/api";

export interface ClothingAnalysis {
  name: string;
  category: string;
  subcategory: string | null;
  primaryColor: string | null;
  secondaryColors: string[];
  colorTemperature: string | null;
  colorIntensity: string | null;
  pattern: string | null;
  material: string | null;
  texture: string | null;
  transparency: string | null;
  printType: string | null;
  gender: string | null;
  formality: number | null;
  occasion: string[];
  style: string[];
  season: string[];
  brand: string | null;
  tags: string[];
  fit: string | null;
  sleeveLength: string | null;
  sleeveStyle: string | null;
  neckline: string | null;
  collarType: string | null;
  cuffStyle: string | null;
  length: string | null;
  hemStyle: string | null;
  closureType: string | null;
  rise: string | null;
  pleatStyle: string | null;
  distressing: string | null;
  waistbandStyle: string | null;
  silhouette: string | null;
  backDetail: string | null;
  strapStyle: string | null;
  lining: string | null;
  warmthLevel: string | null;
  waterResistance: string | null;
  hood: string | null;
  pockets: string | null;
  heelHeight: string | null;
  heelStyle: string | null;
  toeStyle: string | null;
  soleType: string | null;
  shaftHeight: string | null;
  accessoryType: string | null;
  bandWidth: string | null;
  sockHeight: string | null;
  necklaceLength: string | null;
  hatStyle: string | null;
  earringStyle: string | null;
  tieStyle: string | null;
  watchStyle: string | null;
  lensColor: string | null;
  legOpening: string | null;
  confidence: number;
  [key: string]: unknown;
}

export const aiAnalysisService = {
  async analyzeClothing(imageUrl: string): Promise<ClothingAnalysis> {
    return api.post<ClothingAnalysis>("/ai/analyze-clothing", { imageUrl });
  },
};
