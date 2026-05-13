import { X, Sparkles } from "lucide-react";
import type { ShoppingRecommendation } from "@/types/shopping";

interface RecommendationCardProps {
  recommendation: ShoppingRecommendation;
  onDismiss: (id: string) => void;
}

export function RecommendationCard({ recommendation, onDismiss }: RecommendationCardProps) {
  return (
    <div className="bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] rounded-2xl shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)] overflow-hidden group hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] touch-press">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={recommendation.imageUrl} alt={recommendation.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button onClick={() => onDismiss(recommendation.id)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
          <X className="w-3.5 h-3.5" />
        </button>
        {/* Match score badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--frost)/0.9)] backdrop-blur-sm text-xs font-semibold">
          <Sparkles className="w-3 h-3" />
          {recommendation.matchScore}%
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-semibold">{recommendation.name}</h3>
          <span className="text-sm font-bold ml-2 flex-shrink-0">${recommendation.estimatedPrice}</span>
        </div>
        <p className="text-xs text-muted-foreground">{recommendation.brand}</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">{recommendation.reason}</p>
      </div>
    </div>
  );
}
