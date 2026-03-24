import type { ClothingItem } from "@/types/wardrobe";

const delay = (ms: number = 300) => new Promise((r) => setTimeout(r, ms));

export const wardrobeService = {
  async getAll(): Promise<ClothingItem[]> {
    await delay();
    return [];
  },
  async create(item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">): Promise<ClothingItem> {
    await delay();
    return { ...item, id: `item-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },
  async update(id: string, updates: Partial<ClothingItem>): Promise<ClothingItem> {
    await delay();
    return { id, ...updates } as ClothingItem;
  },
  async delete(id: string): Promise<void> {
    await delay();
  },
};
