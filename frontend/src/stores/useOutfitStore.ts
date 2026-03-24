import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Outfit, OutfitItem, OutfitOccasion, OutfitSlotKey } from "@/types/outfit";
import type { ClothingItem, Season } from "@/types/wardrobe";
import { mockOutfits } from "@/data/mockOutfits";

interface OutfitState {
  outfits: Outfit[];
  currentBuild: Partial<Record<OutfitSlotKey, OutfitItem | null>>;
  isGenerating: boolean;
  loadOutfits: () => void;
  generateOutfit: (occasion: OutfitOccasion, season: Season, wardrobeItems: ClothingItem[]) => Promise<Outfit>;
  saveOutfit: (outfit: Outfit) => void;
  deleteOutfit: (id: string) => void;
  rateOutfit: (id: string, rating: number) => void;
  setSlotItem: (slot: OutfitSlotKey, item: ClothingItem | null) => void;
  clearBuild: () => void;
}

const REASONING_TEMPLATES = [
  "The {top} paired with {bottom} creates a balanced silhouette. {shoes} ground the look for a {occasion} setting.",
  "This outfit leverages contrasting tones for a cohesive, intentional feel. The {shoes} add a finishing touch.",
  "A {occasion}-ready combination: the {top} brings structure while the {bottom} keeps things relaxed.",
  "Clean and effortless — the {top} works as a versatile base, while the {bottom} adds visual weight.",
  "This pairing plays with proportion: the {top} keeps the upper body streamlined, and the {bottom} adds volume.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useOutfitStore = create<OutfitState>()(
  persist(
    (set, get) => ({
      outfits: [],
      currentBuild: {},
      isGenerating: false,

      loadOutfits: () => {
        const { outfits } = get();
        if (outfits.length === 0) {
          set({ outfits: mockOutfits });
        }
      },

      generateOutfit: async (occasion, season, wardrobeItems) => {
        set({ isGenerating: true });

        await new Promise((r) => setTimeout(r, 1500));

        const tops = wardrobeItems.filter((i) => i.category === "tops");
        const bottoms = wardrobeItems.filter((i) => i.category === "bottoms");
        const shoes = wardrobeItems.filter((i) => i.category === "shoes");
        const outerwear = wardrobeItems.filter((i) => i.category === "outerwear");
        const accessories = wardrobeItems.filter((i) => i.category === "accessories");

        const top = pickRandom(tops);
        const bottom = pickRandom(bottoms);
        const shoe = pickRandom(shoes);

        const items: OutfitItem[] = [
          { slot: "top", clothingItemId: top.id, clothingItem: top },
          { slot: "bottom", clothingItemId: bottom.id, clothingItem: bottom },
          { slot: "shoes", clothingItemId: shoe.id, clothingItem: shoe },
        ];

        if (outerwear.length > 0 && Math.random() > 0.5) {
          const ow = pickRandom(outerwear);
          items.push({ slot: "outerwear", clothingItemId: ow.id, clothingItem: ow });
        }
        if (accessories.length > 0 && Math.random() > 0.6) {
          const acc = pickRandom(accessories);
          items.push({ slot: "accessory1", clothingItemId: acc.id, clothingItem: acc });
        }

        const template = pickRandom(REASONING_TEMPLATES);
        const reasoning = template
          .replace("{top}", top.name)
          .replace("{bottom}", bottom.name)
          .replace("{shoes}", shoe.name)
          .replace("{occasion}", occasion);

        const score = Math.floor(Math.random() * 24) + 75;
        const count = get().outfits.length;

        const outfit: Outfit = {
          id: `o-${Date.now()}`,
          name: `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Look #${count + 1}`,
          items,
          occasion,
          season: [season],
          aiGenerated: true,
          aiReasoning: reasoning,
          score,
          createdAt: new Date().toISOString(),
        };

        const build: Partial<Record<OutfitSlotKey, OutfitItem | null>> = {};
        items.forEach((item) => { build[item.slot] = item; });

        set((state) => ({
          outfits: [outfit, ...state.outfits],
          currentBuild: build,
          isGenerating: false,
        }));

        return outfit;
      },

      saveOutfit: (outfit) => {
        set((state) => {
          const exists = state.outfits.find((o) => o.id === outfit.id);
          if (exists) return state;
          return { outfits: [outfit, ...state.outfits] };
        });
      },

      deleteOutfit: (id) => {
        set((state) => ({ outfits: state.outfits.filter((o) => o.id !== id) }));
      },

      rateOutfit: (id, rating) => {
        set((state) => ({
          outfits: state.outfits.map((o) => (o.id === id ? { ...o, rating } : o)),
        }));
      },

      setSlotItem: (slot, item) => {
        set((state) => ({
          currentBuild: {
            ...state.currentBuild,
            [slot]: item ? { slot, clothingItemId: item.id, clothingItem: item } : null,
          },
        }));
      },

      clearBuild: () => set({ currentBuild: {} }),
    }),
    { name: "idrip-outfits" }
  )
);
