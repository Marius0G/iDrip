import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShoppingRecommendation, BudgetSettings, StylePreference } from "@/types/shopping";
import { shoppingService } from "@/services/shoppingService";

interface ShoppingState {
  recommendations: ShoppingRecommendation[];
  saved: ShoppingRecommendation[];
  budget: BudgetSettings;
  selectedStyles: StylePreference[];
  isLoading: boolean;
  isSavedLoading: boolean;
  error: string | null;
  lastLoadedAt: number | null;
  // Stable keys (productUrl or name) of recs the user has permanently
  // dismissed. Persisted client-side for optimistic filtering; the server
  // is the source of truth across devices.
  dismissedKeys: string[];
  loadRecommendations: (force?: boolean) => Promise<void>;
  loadSaved: () => Promise<void>;
  setBudget: (budget: Partial<BudgetSettings>) => void;
  toggleStyle: (style: StylePreference) => void;
  setStyles: (styles: StylePreference[]) => void;
  saveRecommendation: (id: string) => Promise<void>;
  deleteRecommendation: (id: string, source: "spotlight" | "saved") => Promise<void>;
  clearDismissed: () => void;
  getFilteredRecommendations: () => ShoppingRecommendation[];
}

// Reload from API if recs are missing or older than 30 min.
const STALE_AFTER_MS = 30 * 60 * 1000;
// When dismissals drop visible spotlight below this, auto-refresh.
const REFILL_THRESHOLD = 6;

function dismissKey(rec: ShoppingRecommendation): string {
  return rec.productUrl || rec.name;
}

export const useShoppingStore = create<ShoppingState>()(
  persist(
    (set, get) => ({
      recommendations: [],
      saved: [],
      budget: { monthlyBudget: 150, spent: 45, currency: "USD" },
      selectedStyles: ["streetwear", "minimalist", "casual"],
      isLoading: false,
      isSavedLoading: false,
      error: null,
      lastLoadedAt: null,
      dismissedKeys: [],

      loadRecommendations: async (force = false) => {
        const { recommendations, lastLoadedAt, isLoading, budget, selectedStyles } = get();
        if (isLoading) return;

        const fresh = lastLoadedAt && Date.now() - lastLoadedAt < STALE_AFTER_MS;
        if (!force && recommendations.length > 0 && fresh) return;

        set({ isLoading: true, error: null });
        try {
          if (force) {
            try {
              await shoppingService.clearCache();
            } catch (err) {
              console.warn("[shoppingStore] clearCache failed, continuing with force fetch:", err);
            }
          }
          const data = await shoppingService.getRecommendations({
            budget: budget.monthlyBudget,
            styles: selectedStyles,
            force,
          });
          set({ recommendations: data, isLoading: false, lastLoadedAt: Date.now() });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load recommendations";
          console.warn("[shoppingStore]", message);
          set({ isLoading: false, error: message });
        }
      },

      loadSaved: async () => {
        if (get().isSavedLoading) return;
        set({ isSavedLoading: true });
        try {
          const saved = await shoppingService.getSaved();
          set({ saved, isSavedLoading: false });
        } catch (err) {
          console.warn("[shoppingStore] loadSaved failed:", err);
          set({ isSavedLoading: false });
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

      saveRecommendation: async (id) => {
        const state = get();
        const rec = state.recommendations.find((r) => r.id === id);
        if (!rec) return;

        // Optimistic: remove from spotlight, prepend to saved.
        set({
          recommendations: state.recommendations.filter((r) => r.id !== id),
          saved: [rec, ...state.saved.filter((s) => dismissKey(s) !== dismissKey(rec))],
        });

        try {
          await shoppingService.saveItem(rec);
        } catch (err) {
          console.warn("[shoppingStore] saveItem failed; reverting:", err);
          // Revert on failure.
          set({
            recommendations: [rec, ...get().recommendations],
            saved: get().saved.filter((s) => dismissKey(s) !== dismissKey(rec)),
          });
          return;
        }

        // Auto-refresh when the spotlight thins out — keeps the user in a
        // steady "8 fresh picks" experience.
        const visible = get().recommendations.filter(
          (r) => !new Set(get().dismissedKeys).has(dismissKey(r))
        ).length;
        if (visible < REFILL_THRESHOLD) {
          void get().loadRecommendations(true);
        }
      },

      deleteRecommendation: async (id, source) => {
        const state = get();
        const rec = source === "spotlight"
          ? state.recommendations.find((r) => r.id === id)
          : state.saved.find((r) => r.id === id);
        if (!rec) return;
        const key = dismissKey(rec);

        // Optimistic: remove everywhere, add to dismissedKeys.
        set({
          recommendations: state.recommendations.filter((r) => dismissKey(r) !== key),
          saved: state.saved.filter((r) => dismissKey(r) !== key),
          dismissedKeys: state.dismissedKeys.includes(key)
            ? state.dismissedKeys
            : [...state.dismissedKeys, key],
        });

        try {
          await shoppingService.deleteItem(key);
        } catch (err) {
          console.warn("[shoppingStore] deleteItem failed:", err);
          // Don't revert — the optimistic delete is mostly fine; user can
          // refresh to re-sync if the server didn't accept it.
        }

        if (source === "spotlight") {
          const visible = get().recommendations.length;
          if (visible < REFILL_THRESHOLD) {
            void get().loadRecommendations(true);
          }
        }
      },

      clearDismissed: () => set({ dismissedKeys: [] }),

      getFilteredRecommendations: () => {
        const { recommendations, budget, dismissedKeys } = get();
        const remaining = budget.monthlyBudget - budget.spent;
        const dismissed = new Set(dismissedKeys);
        return recommendations
          .filter((r) => !dismissed.has(dismissKey(r)))
          .filter((r) => r.estimatedPrice <= remaining)
          .sort((a, b) => b.matchScore - a.matchScore);
      },
    }),
    {
      name: "idrip-shopping",
      partialize: (state) => ({
        budget: state.budget,
        selectedStyles: state.selectedStyles,
        recommendations: state.recommendations,
        lastLoadedAt: state.lastLoadedAt,
        dismissedKeys: state.dismissedKeys,
      }) as Partial<ShoppingState>,
    }
  )
);
