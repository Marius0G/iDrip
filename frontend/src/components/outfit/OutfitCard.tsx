import { Sparkles, Trash2 } from "lucide-react";
import type { Outfit } from "@/types/outfit";

interface OutfitCardProps {
  outfit: Outfit;
  onDelete?: (id: string) => void;
}

export function OutfitCard({ outfit, onDelete }: OutfitCardProps) {
  return (
    <div className="bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] rounded-2xl shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)]">
      <div className="flex -space-x-2 p-4 pb-0">
        {outfit.items.slice(0, 4).map((item, i) => (
          <div key={item.clothingItemId} className="w-20 h-24 rounded-xl overflow-hidden border-2 border-[hsl(var(--frost))] shadow-sm flex-shrink-0" style={{ zIndex: 4 - i }}>
            <img src={item.clothingItem.imageUrl} alt={item.clothingItem.name} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">{outfit.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground capitalize">{outfit.occasion}</span>
              {outfit.score && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" /> {outfit.score}
                </span>
              )}
            </div>
          </div>
          {onDelete && (
            <button onClick={() => onDelete(outfit.id)} className="p-2 rounded-lg hover:bg-[hsl(var(--frost))] text-muted-foreground hover:text-[hsl(var(--punctuation))] transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {outfit.aiReasoning && (
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-2">{outfit.aiReasoning}</p>
        )}
      </div>
    </div>
  );
}
