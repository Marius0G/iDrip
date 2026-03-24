import { NavLink } from "react-router-dom";
import { LayoutDashboard, Shirt, Wand2, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { path: ROUTES.HOME, label: "Home", icon: LayoutDashboard },
  { path: ROUTES.WARDROBE, label: "Wardrobe", icon: Shirt },
  { path: ROUTES.GENERATOR, label: "AI", icon: Wand2 },
  { path: ROUTES.SHOPPING, label: "Shop", icon: ShoppingBag },
  { path: ROUTES.PROFILE, label: "Profile", icon: User },
];

export function MobileNav() {
  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav safe-area-bottom">
      <div className="flex items-center justify-around w-full px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 min-w-[3.5rem]",
                isActive
                  ? "text-black dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-black dark:bg-white" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
