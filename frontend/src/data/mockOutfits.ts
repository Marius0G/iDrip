import type { Outfit } from "@/types/outfit";
import { mockClothingItems } from "./mockClothingItems";

const findItem = (id: string) => mockClothingItems.find((i) => i.id === id)!;

export const mockOutfits: Outfit[] = [
  {
    id: "o1", name: "Minimal Monochrome", occasion: "work", season: ["all"], rating: 4, aiGenerated: true, score: 92,
    aiReasoning: "The White Oxford Shirt paired with Black Slim Jeans creates a clean, timeless silhouette. White Leather Sneakers keep it approachable and modern.",
    items: [
      { slot: "top", clothingItemId: "2", clothingItem: findItem("2") },
      { slot: "bottom", clothingItemId: "6", clothingItem: findItem("6") },
      { slot: "shoes", clothingItemId: "10", clothingItem: findItem("10") },
    ],
    createdAt: "2024-02-10T14:00:00Z",
  },
  {
    id: "o2", name: "Streetwear Essentials", occasion: "casual", season: ["fall", "winter"], rating: 5, aiGenerated: true, score: 88,
    aiReasoning: "The Olive Hoodie adds a pop of earth tone against the Dark Wash Denim. Black Chelsea Boots elevate the streetwear vibe with a smart edge.",
    items: [
      { slot: "top", clothingItemId: "4", clothingItem: findItem("4") },
      { slot: "bottom", clothingItemId: "8", clothingItem: findItem("8") },
      { slot: "shoes", clothingItemId: "11", clothingItem: findItem("11") },
      { slot: "outerwear", clothingItemId: "13", clothingItem: findItem("13") },
    ],
    createdAt: "2024-02-12T16:00:00Z",
  },
  {
    id: "o3", name: "Smart Casual Friday", occasion: "work", season: ["spring"], rating: 4, aiGenerated: true, score: 90,
    aiReasoning: "Cream Knit Polo with Khaki Chinos creates an effortlessly polished look. Brown Loafers add warmth and formality.",
    items: [
      { slot: "top", clothingItemId: "5", clothingItem: findItem("5") },
      { slot: "bottom", clothingItemId: "9", clothingItem: findItem("9") },
      { slot: "shoes", clothingItemId: "12", clothingItem: findItem("12") },
    ],
    createdAt: "2024-02-15T11:00:00Z",
  },
  {
    id: "o4", name: "Cozy Weekend", occasion: "casual", season: ["winter"], aiGenerated: true, score: 85,
    aiReasoning: "Navy Crewneck Sweater layered over Dark Wash Denim creates a warm, relaxed vibe. Black Chelsea Boots complete the cold-weather look.",
    items: [
      { slot: "top", clothingItemId: "3", clothingItem: findItem("3") },
      { slot: "bottom", clothingItemId: "8", clothingItem: findItem("8") },
      { slot: "shoes", clothingItemId: "11", clothingItem: findItem("11") },
      { slot: "outerwear", clothingItemId: "15", clothingItem: findItem("15") },
    ],
    createdAt: "2024-02-18T09:00:00Z",
  },
  {
    id: "o5", name: "Date Night", occasion: "date", season: ["spring", "fall"], aiGenerated: true, score: 94,
    aiReasoning: "Black Oversized Tee tucked into Cream Wide-Leg Trousers creates visual contrast and modern proportions. White Sneakers keep it casual yet intentional.",
    items: [
      { slot: "top", clothingItemId: "1", clothingItem: findItem("1") },
      { slot: "bottom", clothingItemId: "7", clothingItem: findItem("7") },
      { slot: "shoes", clothingItemId: "10", clothingItem: findItem("10") },
      { slot: "accessory1", clothingItemId: "16", clothingItem: findItem("16") },
    ],
    createdAt: "2024-02-20T19:00:00Z",
  },
];
