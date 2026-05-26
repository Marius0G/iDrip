import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShoppingRecommendation, BudgetSettings, StylePreference } from "@/types/shopping";
import { shoppingService } from "@/services/shoppingService";

export type HiddenItem = ShoppingRecommendation & { stableKey: string };

interface ShoppingState {
  recommendations: ShoppingRecommendation[];
  saved: ShoppingRecommendation[];
  hidden: HiddenItem[];
  budget: BudgetSettings;
  selectedStyles: StylePreference[];
  isLoading: boolean;
  isSavedLoading: boolean;
  isHiddenLoading: boolean;
  error: string | null;
  lastLoadedAt: number | null;
  // Stable keys (productUrl or name) of recs the user has permanently
  // dismissed. Persisted client-side for optimistic filtering; the server
  // is the source of truth across devices.
  dismissedKeys: string[];
  loadRecommendations: (force?: boolean) => Promise<void>;
  loadSaved: () => Promise<void>;
  loadHidden: () => Promise<void>;
  setBudget: (budget: Partial<BudgetSettings>) => void;
  toggleStyle: (style: StylePreference) => void;
  setStyles: (styles: StylePreference[]) => void;
  saveRecommendation: (id: string) => Promise<void>;
  hideRecommendation: (id: string, source: "spotlight" | "saved") => Promise<void>;
  deleteRecommendation: (id: string, source: "spotlight" | "saved") => Promise<void>;
  restoreHidden: (stableKey: string) => Promise<void>;
  deleteHiddenForever: (stableKey: string) => Promise<void>;
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
      hidden: [],
      budget: { monthlyBudget: 150, spent: 45, currency: "USD" },
      selectedStyles: ["streetwear", "minimalist", "casual"],
      isLoading: false,
      isSavedLoading: false,
      isHiddenLoading: false,
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

      loadHidden: async () => {
        if (get().isHiddenLoading) return;
        set({ isHiddenLoading: true });
        try {
          const hidden = await shoppingService.getHidden();
          set({ hidden, isHiddenLoading: false });
        } catch (err) {
          console.warn("[shoppingStore] loadHidden failed:", err);
          set({ isHiddenLoading: false });
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

      hideRecommendation: async (id, source) => {
        const state = get();
        const rec = source === "spotlight"
          ? state.recommendations.find((r) => r.id === id)
          : state.saved.find((r) => r.id === id);
        if (!rec) return;
        const key = dismissKey(rec);

        // Optimistic: pull from current view, push to hidden, dismiss key.
        set({
          recommendations: state.recommendations.filter((r) => dismissKey(r) !== key),
          saved: state.saved.filter((r) => dismissKey(r) !== key),
          hidden: [{ ...rec, stableKey: key }, ...state.hidden.filter((h) => h.stableKey !== key)],
          dismissedKeys: state.dismissedKeys.includes(key)
            ? state.dismissedKeys
            : [...state.dismissedKeys, key],
        });

        try {
          await shoppingService.hideItem(key, rec);
        } catch (err) {
          console.warn("[shoppingStore] hideItem failed:", err);
        }

        if (source === "spotlight" && get().recommendations.length < REFILL_THRESHOLD) {
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

        // Permanent: remove from view + saved, NEVER show in hidden.
        set({
          recommendations: state.recommendations.filter((r) => dismissKey(r) !== key),
          saved: state.saved.filter((r) => dismissKey(r) !== key),
          dismissedKeys: state.dismissedKeys.includes(key)
            ? state.dismissedKeys
            : [...state.dismissedKeys, key],
        });

        try {
          await shoppingService.deleteItem(key, rec);
        } catch (err) {
          console.warn("[shoppingStore] deleteItem failed:", err);
        }

        if (source === "spotlight" && get().recommendations.length < REFILL_THRESHOLD) {
          void get().loadRecommendations(true);
        }
      },

      restoreHidden: async (stableKey) => {
        const state = get();
        // Optimistic: remove from hidden + dismissedKeys so it can resurface.
        set({
          hidden: state.hidden.filter((h) => h.stableKey !== stableKey),
          dismissedKeys: state.dismissedKeys.filter((k) => k !== stableKey),
        });
        try {
          await shoppingService.restoreHidden(stableKey);
        } catch (err) {
          console.warn("[shoppingStore] restoreHidden failed:", err);
        }
      },

      deleteHiddenForever: async (stableKey) => {
        const state = get();
        // Optimistic: remove from hidden view; keep the dismiss key so the AI
        // filter still excludes it.
        set({
          hidden: state.hidden.filter((h) => h.stableKey !== stableKey),
        });
        try {
          await shoppingService.deleteHiddenForever(stableKey);
        } catch (err) {
          console.warn("[shoppingStore] deleteHiddenForever failed:", err);
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
        // hidden + saved are server-truth, refetched on tab open — don't persist
      }) as Partial<ShoppingState>,
    }
  )
);
