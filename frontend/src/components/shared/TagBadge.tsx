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
          ? "bg-[hsl(var(--glacier))] text-white border-transparent"
          : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)] hover:bg-[hsl(var(--frost))]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {label}
    </button>
  );
}
