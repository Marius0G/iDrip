import { NavLink } from "react-router-dom";
import { LayoutDashboard, Shirt, Wand2, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { path: ROUTES.HOME, label: "Home", icon: LayoutDashboard },
  { path: ROUTES.WARDROBE, label: "Wardrobe", icon: Shirt },
  { path: ROUTES.GENERATOR, label: "Generator", icon: Wand2 },
  { path: ROUTES.SHOPPING, label: "Shopping", icon: ShoppingBag },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/60 dark:bg-white/[0.03] backdrop-blur-2xl border-r border-black/[0.06] dark:border-white/[0.08] z-40">
      {/* Logo */}
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-black dark:text-white">iDrip</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">AI Personal Stylist</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-black text-white dark:bg-white/[0.12] dark:text-white shadow-md dark:shadow-black/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/[0.06] hover:text-black dark:hover:text-gray-200"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profile at bottom */}
      <div className="p-3 border-t border-white/10">
        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
            )
          }
        >
          <User className="w-5 h-5" />
          Profile
        </NavLink>
      </div>
    </aside>
  );
}
