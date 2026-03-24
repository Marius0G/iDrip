import { cn } from "@/lib/utils";
import { STYLE_OPTIONS } from "@/data/styles";
import type { StylePreference } from "@/types/shopping";

interface StyleTagSelectorProps {
  selected: StylePreference[];
  onToggle: (style: StylePreference) => void;
  className?: string;
}

export function StyleTagSelector({ selected, onToggle, className }: StyleTagSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {STYLE_OPTIONS.map((style) => (
        <button
          key={style.value}
          onClick={() => onToggle(style.value as StylePreference)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
            selected.includes(style.value as StylePreference)
              ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md"
              : "bg-white/50 dark:bg-white/5 text-muted-foreground border-white/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          )}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}
