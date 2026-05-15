import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Shirt,
  Wand2,
  ShoppingBag,
  User,
} from "lucide-react";
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
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 sidebar-shell border-t safe-area-bottom">
      <div className="flex items-center justify-around w-full px-1.5 pt-2 pb-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn("sidebar-tab", isActive && "sidebar-tab-active")
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
