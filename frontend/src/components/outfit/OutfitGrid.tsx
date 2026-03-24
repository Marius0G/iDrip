import type { Outfit } from "@/types/outfit";
import { OutfitCard } from "./OutfitCard";

interface OutfitGridProps {
  outfits: Outfit[];
  onDelete?: (id: string) => void;
}

export function OutfitGrid({ outfits, onDelete }: OutfitGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {outfits.map((outfit) => (
        <OutfitCard key={outfit.id} outfit={outfit} onDelete={onDelete} />
      ))}
    </div>
  );
}
