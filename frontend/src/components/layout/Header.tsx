import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="md:hidden sticky top-0 z-40 glass-nav px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-black dark:text-white">i</span>
          <span className="text-gray-400">Drip</span>
        </h1>
        <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
          <span className="text-xs font-semibold">A</span>
        </div>
      </div>
    </header>
  );
}
