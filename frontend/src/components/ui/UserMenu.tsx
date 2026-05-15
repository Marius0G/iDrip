import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useUserStore } from "@/stores/useUserStore";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-semibold transition-colors",
          "border-[hsl(var(--sidebar-border)/0.8)] bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))]",
          open && "ring-2 ring-[hsl(var(--sidebar-fg)/0.15)]"
        )}
      >
        {user?.name?.charAt(0) || "?"}
      </button>

      <div
        id={menuId}
        role="menu"
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-[calc(100%+8px)] z-50 min-w-56 origin-top-right",
          "rounded-xl border p-1 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)]",
          "bg-[hsl(var(--sidebar-surface))] border-[hsl(var(--sidebar-border))]",
          "transition-all duration-150",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="px-3 py-2 border-b border-[hsl(var(--sidebar-border)/0.7)] mb-1">
          <div className="text-sm font-semibold kit-strong truncate">
            {user?.name || "User"}
          </div>
          <div className="text-xs kit-muted truncate">{user?.email || ""}</div>
        </div>

        <MenuItem icon={UserIcon} label="Profile" onSelect={() => go(ROUTES.PROFILE)} />
        <MenuItem
          icon={CreditCard}
          label="Subscription"
          onSelect={() => go(ROUTES.SUBSCRIPTION)}
        />

        <div className="my-1 h-px bg-[hsl(var(--sidebar-border)/0.7)]" />

        <MenuItem
          icon={LogOut}
          label="Log out"
          onSelect={handleLogout}
          danger
        />
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: typeof UserIcon;
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

function MenuItem({ icon: Icon, label, onSelect, danger }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors",
        danger
          ? "text-[hsl(var(--sidebar-danger))] hover:bg-[hsl(var(--sidebar-danger)/0.1)]"
          : "kit-strong hover:bg-[hsl(var(--sidebar-hover))]"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
