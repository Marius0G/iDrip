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
    <div
      className={cn(
        "flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:flex-wrap md:overflow-visible md:pb-0 md:mx-0 md:px-0",
        className
      )}
    >
      {STYLE_OPTIONS.map((style) => (
        <button
          key={style.value}
          onClick={() => onToggle(style.value as StylePreference)}
          className={cn(
            "kit-chip flex-shrink-0",
            selected.includes(style.value as StylePreference) && "kit-chip-active"
          )}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}
