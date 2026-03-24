import type { ClothingItem } from "@/types/wardrobe";
import { ClothingCard } from "./ClothingCard";

interface ClothingGridProps {
  items: ClothingItem[];
  onItemClick: (item: ClothingItem) => void;
}

export function ClothingGrid({ items, onItemClick }: ClothingGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ClothingCard key={item.id} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );
}
