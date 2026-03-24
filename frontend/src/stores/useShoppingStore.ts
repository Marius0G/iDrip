import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShoppingRecommendation, BudgetSettings, StylePreference } from "@/types/shopping";
import { mockRecommendations } from "@/data/mockRecommendations";

interface ShoppingState {
  recommendations: ShoppingRecommendation[];
  budget: BudgetSettings;
  selectedStyles: StylePreference[];
  isLoading: boolean;
  loadRecommendations: () => void;
  setBudget: (budget: Partial<BudgetSettings>) => void;
  toggleStyle: (style: StylePreference) => void;
  setStyles: (styles: StylePreference[]) => void;
  dismissRecommendation: (id: string) => void;
  getFilteredRecommendations: () => ShoppingRecommendation[];
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      recommendations: [],
      budget: { monthlyBudget: 150, spent: 45, currency: "USD" },
      selectedStyles: ["streetwear", "minimalist", "casual"],
      isLoading: false,

      loadRecommendations: () => {
        const { recommendations } = get();
        if (recommendations.length === 0) {
          set({ recommendations: mockRecommendations });
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
    { name: "idrip-shopping" }
  )
);
