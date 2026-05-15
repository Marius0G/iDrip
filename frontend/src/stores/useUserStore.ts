import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import type { StylePreference } from "@/types/shopping";

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateStylePreferences: (styles: StylePreference[]) => void;
  updateBudget: (monthlyBudget: number) => void;
  clearAllData: () => void;
}

const emptyUser: User = {
  id: "",
  name: "",
  email: "",
  stylePreferences: [],
  budget: { monthlyBudget: 150, spent: 0, currency: "USD" },
  createdAt: "",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        localStorage.setItem("idrip-token", token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("idrip-token");
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateStylePreferences: (styles) => {
        set((state) => ({
          user: state.user ? { ...state.user, stylePreferences: styles } : null,
        }));
      },

      updateBudget: (monthlyBudget) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, budget: { ...state.user.budget, monthlyBudget } }
            : null,
        }));
      },

      clearAllData: () => {
        localStorage.removeItem("idrip-wardrobe");
        localStorage.removeItem("idrip-outfits");
        localStorage.removeItem("idrip-shopping");
        localStorage.removeItem("idrip-user");
        localStorage.removeItem("idrip-token");
        set({ user: emptyUser, token: null, isAuthenticated: false });
        window.location.reload();
      },
    }),
    { name: "idrip-user" }
  )
);
