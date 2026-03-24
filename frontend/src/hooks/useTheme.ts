import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";

export function useTheme() {
  const theme = useUserStore((s) => s.user.theme);
  const setTheme = useUserStore((s) => s.setTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, [theme]);

  return { theme, setTheme };
}
