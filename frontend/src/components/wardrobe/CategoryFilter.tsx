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
            "kit-chip flex-shrink-0",
            selected === cat.value && "kit-chip-active"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
