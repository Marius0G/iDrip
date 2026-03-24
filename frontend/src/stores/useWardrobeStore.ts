import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClothingItem, WardrobeFilters } from "@/types/wardrobe";
import { mockClothingItems } from "@/data/mockClothingItems";

interface WardrobeState {
  items: ClothingItem[];
  filters: WardrobeFilters;
  isLoading: boolean;
  loadItems: () => void;
  addItem: (item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">) => void;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
  deleteItem: (id: string) => void;
  setFilter: (filter: Partial<WardrobeFilters>) => void;
  resetFilters: () => void;
  getFilteredItems: () => ClothingItem[];
  getItemById: (id: string) => ClothingItem | undefined;
}

const defaultFilters: WardrobeFilters = {
  category: "all",
  color: "all",
  season: "all",
  searchQuery: "",
  tags: [],
};

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      items: [],
      filters: defaultFilters,
      isLoading: false,

      loadItems: () => {
        const { items } = get();
        if (items.length === 0) {
          set({ items: mockClothingItems });
        }
      },

      addItem: (itemData) => {
        const now = new Date().toISOString();
        const newItem: ClothingItem = {
          ...itemData,
          id: `item-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      setFilter: (filter) => {
        set((state) => ({ filters: { ...state.filters, ...filter } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      getFilteredItems: () => {
        const { items, filters } = get();
        return items.filter((item) => {
          if (filters.category !== "all" && item.category !== filters.category) return false;
          if (filters.color !== "all" && item.color !== filters.color) return false;
          if (filters.season !== "all" && !item.season.includes(filters.season) && !item.season.includes("all")) return false;
          if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            if (!item.name.toLowerCase().includes(q) && !item.brand?.toLowerCase().includes(q) && !item.tags.some((t) => t.toLowerCase().includes(q))) return false;
          }
          if (filters.tags.length > 0 && !filters.tags.some((t) => item.tags.includes(t))) return false;
          return true;
        });
      },

      getItemById: (id) => get().items.find((item) => item.id === id),
    }),
    { name: "idrip-wardrobe" }
  )
);
