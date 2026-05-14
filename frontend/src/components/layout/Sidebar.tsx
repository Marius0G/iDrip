import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Shirt,
  Wand2,
  ShoppingBag,
  Crown,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useUserStore } from "@/stores/useUserStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";

const navItems = [
  { path: ROUTES.HOME, label: "Home", icon: LayoutDashboard },
  { path: ROUTES.WARDROBE, label: "Wardrobe", icon: Shirt },
  { path: ROUTES.GENERATOR, label: "Generator", icon: Wand2 },
  { path: ROUTES.SHOPPING, label: "Shopping", icon: ShoppingBag },
];

export function Sidebar() {
  const logout = useUserStore((s) => s.logout);
  const tier = useSubscriptionStore((s) => s.currentSubscription?.tier || 'free');

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[hsl(var(--frost)/0.75)] backdrop-blur-2xl border-r border-[hsl(var(--border)/0.4)] z-40">
      {/* Logo */}
      <div className="px-6 pt-7 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          iDrip<span className="text-[hsl(var(--punctuation))]">.</span>
        </h1>
        <p className="text-overline mt-1.5">
          AI Personal Stylist<span className="text-[hsl(var(--punctuation))]">.</span>
        </p>
      </div>

      {/* Angular accent strip — glacier blue peak */}
      <div className="mx-6 h-[2px] bg-gradient-to-r from-[hsl(var(--glacier))] via-[hsl(var(--glacier)/0.4)] to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                isActive
                  ? "bg-[hsl(var(--glacier))] text-white shadow-[0_4px_12px_-2px_hsl(var(--glacier)/0.35)]"
                  : "text-[hsl(var(--peak)/0.65)] hover:text-[hsl(var(--peak))] hover:bg-[hsl(var(--frost))]"
              )
            }
          >
            <item.icon
              className={cn(
                "w-[18px] h-[18px] transition-transform duration-200",
                "group-hover:scale-110"
              )}
            />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section — upgrade (free only) + profile + sign out */}
      <div className="px-3 pb-4 space-y-0.5">
        {/* Thin red rule */}
        <div className="mx-3 mb-2 h-px bg-[hsl(var(--punctuation)/0.2)]" />

        {tier === 'free' && (
          <NavLink
            to={ROUTES.SUBSCRIPTION}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[hsl(var(--glacier))] text-white shadow-[0_4px_12px_-2px_hsl(var(--glacier)/0.35)]"
                  : "text-[hsl(var(--glacier))] hover:bg-[hsl(var(--glacier)/0.08)]"
              )
            }
          >
            <Crown className="w-[18px] h-[18px]" />
            Upgrade
          </NavLink>
        )}

        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-[hsl(var(--glacier))] text-white shadow-[0_4px_12px_-2px_hsl(var(--glacier)/0.35)]"
                : "text-[hsl(var(--peak)/0.65)] hover:text-[hsl(var(--peak))] hover:bg-[hsl(var(--frost))]"
            )
          }
        >
          <User className="w-[18px] h-[18px]" />
          Profile
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-[hsl(var(--peak)/0.5)] hover:text-[hsl(var(--punctuation))] hover:bg-[hsl(var(--punctuation)/0.06)]"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
