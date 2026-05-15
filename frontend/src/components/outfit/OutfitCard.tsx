import { Sparkles, Trash2, Shirt } from "lucide-react";
import type { Outfit } from "@/types/outfit";

interface OutfitCardProps {
  outfit: Outfit;
  onDelete?: (id: string) => void;
}

export function OutfitCard({ outfit, onDelete }: OutfitCardProps) {
  return (
    <div className="kit-card p-4">
      <div className="grid grid-cols-2 gap-2 h-48 mb-4">
        {[0, 1, 2, 3].map((i) => {
          const item = outfit.items[i];
          return (
            <div
              key={i}
              className="kit-thumb flex items-center justify-center"
            >
              {item ? (
                <img
                  src={item.clothingItem.imageUrl}
                  alt={item.clothingItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Shirt className="w-6 h-6 kit-muted opacity-40" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold truncate kit-strong">
            {outfit.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 text-xs kit-muted">
            <span className="capitalize">{outfit.occasion}</span>
            {outfit.score && (
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {outfit.score}
              </span>
            )}
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(outfit.id)}
            aria-label="Delete outfit"
            className="kit-icon-pill flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {outfit.aiReasoning && (
        <p className="text-xs kit-muted mt-3 leading-relaxed line-clamp-2">
          {outfit.aiReasoning}
        </p>
      )}
    </div>
  );
}
