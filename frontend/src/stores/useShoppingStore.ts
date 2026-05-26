import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShoppingRecommendation, BudgetSettings, StylePreference } from "@/types/shopping";
import { shoppingService } from "@/services/shoppingService";

interface ShoppingState {
  recommendations: ShoppingRecommendation[];
  budget: BudgetSettings;
  selectedStyles: StylePreference[];
  isLoading: boolean;
  error: string | null;
  lastLoadedAt: number | null;
  loadRecommendations: (force?: boolean) => Promise<void>;
  setBudget: (budget: Partial<BudgetSettings>) => void;
  toggleStyle: (style: StylePreference) => void;
  setStyles: (styles: StylePreference[]) => void;
  dismissRecommendation: (id: string) => void;
  getFilteredRecommendations: () => ShoppingRecommendation[];
}

// Reload from API if recs are missing or older than 30 min.
const STALE_AFTER_MS = 30 * 60 * 1000;

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      recommendations: [],
      budget: { monthlyBudget: 150, spent: 45, currency: "USD" },
      selectedStyles: ["streetwear", "minimalist", "casual"],
      isLoading: false,
      error: null,
      lastLoadedAt: null,

      loadRecommendations: async (force = false) => {
        const { recommendations, lastLoadedAt, isLoading, budget, selectedStyles } = get();
        if (isLoading) return;

        const fresh = lastLoadedAt && Date.now() - lastLoadedAt < STALE_AFTER_MS;
        if (!force && recommendations.length > 0 && fresh) return;

        set({ isLoading: true, error: null });
        try {
          const data = await shoppingService.getRecommendations({
            budget: budget.monthlyBudget,
            styles: selectedStyles,
          });
          set({ recommendations: data, isLoading: false, lastLoadedAt: Date.now() });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load recommendations";
          console.warn("[shoppingStore]", message);
          set({ isLoading: false, error: message });
        }
      },

      setBudget: (budgetUpdate) => {
        set((state) => ({ budget: { ...state.budget, ...budgetUpdate } }));
      },

      toggleStyle: (style) => {
        set((state) => {
          const styles = state.selectedStyles.includes(style)
            ? state.selectedStyles.filter((s) => s !== style)
            : [...state.selectedStyles, style];
          return { selectedStyles: styles };
        });
      },

      setStyles: (styles) => set({ selectedStyles: styles }),

      dismissRecommendation: (id) => {
        set((state) => ({
          recommendations: state.recommendations.filter((r) => r.id !== id),
        }));
      },

      getFilteredRecommendations: () => {
        const { recommendations, budget } = get();
        const remaining = budget.monthlyBudget - budget.spent;
        return recommendations
          .filter((r) => r.estimatedPrice <= remaining)
          .sort((a, b) => b.matchScore - a.matchScore);
      },
    }),
    {
      name: "idrip-shopping",
      // Persist user choices + cache hints; never persist transient runtime state.
      partialize: (state) => ({
        budget: state.budget,
        selectedStyles: state.selectedStyles,
        recommendations: state.recommendations,
        lastLoadedAt: state.lastLoadedAt,
      }) as Partial<ShoppingState>,
    }
  )
);
