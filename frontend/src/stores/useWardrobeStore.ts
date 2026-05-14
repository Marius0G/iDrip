import { create } from "zustand";
import type { ClothingItem, ClothingItemInput, WardrobeFilters } from "@/types/wardrobe";
import { wardrobeService } from "@/services/wardrobeService";

interface WardrobeState {
  items: ClothingItem[];
  filters: WardrobeFilters;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  loadItems: () => Promise<void>;
  addItem: (data: ClothingItemInput) => Promise<ClothingItem>;
  updateItem: (id: string, updates: Partial<ClothingItemInput>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
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

export const useWardrobeStore = create<WardrobeState>()((set, get) => ({
  items: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,
  initialized: false,

  loadItems: async () => {
    if (get().initialized) return;
    set({ isLoading: true, error: null });
    try {
      const items = await wardrobeService.getAll();
      set({ items, initialized: true });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load wardrobe" });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (data) => {
    const item = await wardrobeService.create(data);
    set((state) => ({ items: [item, ...state.items] }));
    return item;
  },

  updateItem: async (id, updates) => {
    const updated = await wardrobeService.update(id, updates);
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? updated : item)),
    }));
  },

  deleteItem: async (id) => {
    await wardrobeService.remove(id);
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
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.brand?.toLowerCase().includes(q) &&
          !item.tags.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      if (filters.tags.length > 0 && !filters.tags.some((t) => item.tags.includes(t))) return false;
      return true;
    });
  },

  getItemById: (id) => get().items.find((item) => item.id === id),
}));
