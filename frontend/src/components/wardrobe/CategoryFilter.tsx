import { cn } from "@/lib/utils";
import { CLOTHING_CATEGORIES } from "@/data/categories";
import type { ClothingCategory } from "@/types/wardrobe";

interface CategoryFilterProps {
  selected: ClothingCategory | "all";
  onChange: (category: ClothingCategory | "all") => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {CLOTHING_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value as ClothingCategory | "all")}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            selected === cat.value
              ? "bg-[hsl(var(--glacier))] text-white shadow-md"
              : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground hover:bg-[hsl(var(--frost))] border border-[hsl(var(--border)/0.4)]"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
