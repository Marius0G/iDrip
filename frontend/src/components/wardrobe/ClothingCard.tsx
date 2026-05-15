import type { ClothingItem } from "@/types/wardrobe";

interface ClothingCardProps {
  item: ClothingItem;
  onClick: () => void;
}

export function ClothingCard({ item, onClick }: ClothingCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full kit-card p-3 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div className="kit-thumb aspect-[3/4] mb-3">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="font-display text-base font-semibold truncate kit-strong">
        {item.name}
      </h3>
      <div className="flex items-center justify-between gap-2 mt-0.5 text-xs kit-muted">
        <span className="capitalize truncate">{item.category}</span>
        {item.brand && <span className="truncate">{item.brand}</span>}
      </div>
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {item.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="kit-pill capitalize">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
