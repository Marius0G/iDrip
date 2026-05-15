import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { LogoWide } from "@/components/brand/Logo";
import { UserMenu } from "@/components/ui/UserMenu";

export function Header() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="md:hidden sticky top-0 z-40 sidebar-shell border-b safe-area-top">
      <div className="flex items-center justify-between px-4 py-2.5">
        <LogoWide className="h-6 w-auto" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Light" : "Dark"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[hsl(var(--sidebar-accent))] text-black shadow-[0_2px_10px_-2px_hsl(var(--sidebar-accent)/0.5)] active:scale-[0.96] hover:brightness-110 transition-all"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
