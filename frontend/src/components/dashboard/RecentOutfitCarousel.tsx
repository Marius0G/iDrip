import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import type { Outfit } from "@/types/outfit";

interface RecentOutfitCarouselProps {
  outfits: Outfit[];
}

export function RecentOutfitCarousel({ outfits }: RecentOutfitCarouselProps) {
  const navigate = useNavigate();

  if (outfits.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Recent Outfits</h3>
        <button onClick={() => navigate("/generator")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {outfits.slice(0, 5).map((outfit) => (
          <div key={outfit.id} className="flex-shrink-0 w-56">
            <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => navigate("/generator")}>
              <div className="flex -space-x-3 p-3 pb-0">
                {outfit.items.slice(0, 3).map((item, i) => (
                  <div key={item.clothingItemId} className="w-16 h-20 rounded-xl overflow-hidden border-2 border-white dark:border-gray-900 shadow-sm" style={{ zIndex: 3 - i }}>
                    <img src={item.clothingItem.imageUrl} alt={item.clothingItem.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold truncate">{outfit.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Score: {outfit.score}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
