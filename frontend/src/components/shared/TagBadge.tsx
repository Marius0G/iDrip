import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TagBadge({ label, active, onClick, className }: TagBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
        active
          ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
          : "bg-white/50 dark:bg-white/5 text-muted-foreground border-white/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10",
        onClick && "cursor-pointer",
        className
      )}
    >
      {label}
    </button>
  );
}
