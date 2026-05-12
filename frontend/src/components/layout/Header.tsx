export function Header() {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#141418]/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-black dark:text-white">iDrip</span>
        </h1>
        <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
          <span className="text-xs font-semibold">A</span>
        </div>
      </div>
    </header>
  );
}
