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
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[hsl(var(--frost)/0.85)] backdrop-blur-xl safe-area-bottom">
      {/* Glacier accent — thin sharp line at top */}
      <div className="absolute top-0 left-3 right-3 h-px bg-[hsl(var(--glacier)/0.3)]" />

      <div className="flex items-center justify-around w-full px-1.5 pt-2 pb-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold tracking-[0.08em] uppercase transition-all duration-200 relative",
                isActive
                  ? "text-[hsl(var(--glacier))]"
                  : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Angular peak indicator — upward chevron */}
                {isActive && (
                  <div
                    className="absolute -top-[7px] left-1/2 -translate-x-1/2"
                    style={{
                      width: 12,
                      height: 5,
                      clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
                      background: "hsl(var(--glacier))",
                    }}
                  />
                )}

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
