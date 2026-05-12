import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import type { StylePreference } from "@/types/shopping";
import { mockUser } from "@/data/mockUser";

interface UserState {
  user: User;
  loadUser: () => void;
  updateStylePreferences: (styles: StylePreference[]) => void;
  updateBudget: (monthlyBudget: number) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  clearAllData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: mockUser,

      loadUser: () => {
        // User is loaded from persisted state or defaults to mockUser
      },

      updateStylePreferences: (styles) => {
        set((state) => ({ user: { ...state.user, stylePreferences: styles } }));
      },

      updateBudget: (monthlyBudget) => {
        set((state) => ({
          user: { ...state.user, budget: { ...state.user.budget, monthlyBudget } },
        }));
      },

      setTheme: (theme) => {
        set((state) => ({ user: { ...state.user, theme } }));
        if (theme === "dark") document.documentElement.classList.add("dark");
        else if (theme === "light") document.documentElement.classList.remove("dark");
        else {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          document.documentElement.classList.toggle("dark", prefersDark);
        }
      },

      clearAllData: () => {
        localStorage.removeItem("idrip-wardrobe");
        localStorage.removeItem("idrip-outfits");
        localStorage.removeItem("idrip-shopping");
        localStorage.removeItem("idrip-user");
        set({ user: mockUser });
        window.location.reload();
      },
    }),
    { name: "idrip-user" }
  )
);
