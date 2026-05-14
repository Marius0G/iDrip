import { useUserStore } from "@/stores/useUserStore";

export function Header() {
  const user = useUserStore((s) => s.user);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-[hsl(var(--frost)/0.8)] backdrop-blur-xl safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            iDrip<span className="text-[hsl(var(--punctuation))]">.</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70 -mt-0.5">
            Personal Stylist
          </p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-[hsl(var(--glacier)/0.12)] flex items-center justify-center border border-[hsl(var(--glacier)/0.2)]">
          <span className="text-xs font-semibold text-[hsl(var(--peak))]">
            {user?.name?.charAt(0) || "?"}
          </span>
        </div>
      </div>
      {/* Glacier gradient accent */}
      <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[hsl(var(--glacier))] via-[hsl(var(--glacier)/0.3)] to-transparent rounded-full" />
    </header>
  );
}
