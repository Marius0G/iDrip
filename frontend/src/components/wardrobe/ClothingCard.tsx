import type { ClothingItem } from "@/types/wardrobe";

interface ClothingCardProps {
  item: ClothingItem;
  onClick: () => void;
}

export function ClothingCard({ item, onClick }: ClothingCardProps) {
  return (
    <button onClick={onClick} className="group text-left w-full">
      <div className="relative rounded-2xl overflow-hidden bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-lg dark:shadow-black/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-black/10 dark:hover:border-white/15 dark:hover:bg-white/[0.09]">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold truncate">{item.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
            {item.brand && <span className="text-xs text-muted-foreground">{item.brand}</span>}
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-medium text-muted-foreground capitalize">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
