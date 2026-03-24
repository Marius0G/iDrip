import { Sparkles, Trash2 } from "lucide-react";
import type { Outfit } from "@/types/outfit";

interface OutfitCardProps {
  outfit: Outfit;
  onDelete?: (id: string) => void;
}

export function OutfitCard({ outfit, onDelete }: OutfitCardProps) {
  return (
    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-lg overflow-hidden">
      <div className="flex -space-x-2 p-4 pb-0">
        {outfit.items.slice(0, 4).map((item, i) => (
          <div key={item.clothingItemId} className="w-20 h-24 rounded-xl overflow-hidden border-2 border-white dark:border-gray-900 shadow-sm flex-shrink-0" style={{ zIndex: 4 - i }}>
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
            <button onClick={() => onDelete(outfit.id)} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-red-500 transition-colors">
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
