import { useUserStore } from "@/stores/useUserStore";

export function Header() {
  const user = useUserStore((s) => s.user);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-[hsl(var(--frost)/0.8)] backdrop-blur-xl safe-area-top">
      <div className="flex items-center justify-between px-4 py-2.5">
        <h1 className="text-lg font-bold tracking-tight">
          iDrip<span className="text-[hsl(var(--punctuation))]">.</span>
        </h1>
        <div className="w-7 h-7 rounded-lg bg-[hsl(var(--glacier)/0.12)] flex items-center justify-center border border-[hsl(var(--glacier)/0.2)]">
          <span className="text-[11px] font-semibold text-[hsl(var(--peak))]">
            {user?.name?.charAt(0) || "?"}
          </span>
        </div>
      </div>
      {/* Glacier accent line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-[hsl(var(--glacier)/0.25)]" />
    </header>
  );
}
