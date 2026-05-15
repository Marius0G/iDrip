import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Shirt,
  Wand2,
  ShoppingBag,
  Crown,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useUserStore } from "@/stores/useUserStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { useThemeStore, type Theme } from "@/stores/useThemeStore";
import { LogoWide } from "@/components/brand/Logo";

const themeOptions: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

const navItems = [
  { path: ROUTES.HOME, label: "Home", icon: LayoutDashboard },
  { path: ROUTES.WARDROBE, label: "Wardrobe", icon: Shirt },
  { path: ROUTES.GENERATOR, label: "Generator", icon: Wand2 },
  { path: ROUTES.SHOPPING, label: "Shopping", icon: ShoppingBag },
];

export function Sidebar() {
  const logout = useUserStore((s) => s.logout);
  const tier = useSubscriptionStore((s) => s.currentSubscription?.tier || "free");
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 sidebar-shell border-r">
      <div className="px-6 pt-7 pb-4 flex flex-col gap-1.5">
        <LogoWide className="h-7 w-auto self-start" />
        <span className="sidebar-eyebrow">AI Personal Stylist</span>
      </div>

      <div className="mx-6 sidebar-divider" />

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "sidebar-item group",
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              )
            }
          >
            <item.icon className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <div className="mx-3 mb-3 sidebar-divider" />

        <div
          role="radiogroup"
          aria-label="Theme"
          className="flex w-full p-1 mb-1 rounded-xl border bg-[hsl(var(--sidebar-hover))] border-[hsl(var(--sidebar-border)/0.8)]"
        >
          {themeOptions.map((o) => {
            const active = theme === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={o.label}
                title={o.label}
                onClick={() => setTheme(o.value)}
                className={cn(
                  "flex-1 inline-flex items-center justify-center h-7 rounded-lg transition-colors duration-150",
                  active
                    ? "bg-[hsl(var(--sidebar-active-bg))] text-[hsl(var(--sidebar-active-fg))] shadow-sm"
                    : "text-[hsl(var(--sidebar-fg-muted))] hover:text-[hsl(var(--sidebar-fg))]"
                )}
              >
                <o.icon className="w-[15px] h-[15px]" />
              </button>
            );
          })}
        </div>

        {tier === "free" && (
          <NavLink
            to={ROUTES.SUBSCRIPTION}
            className="sidebar-item sidebar-item-accent"
          >
            <Crown className="w-[18px] h-[18px]" />
            Upgrade
          </NavLink>
        )}

        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            cn(
              "sidebar-item",
              isActive ? "sidebar-item-active" : "sidebar-item-inactive"
            )
          }
        >
          <User className="w-[18px] h-[18px]" />
          Profile
        </NavLink>

        <button onClick={logout} className="sidebar-item sidebar-item-danger">
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
