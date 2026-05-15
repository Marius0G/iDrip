import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OutfitItem, OutfitSlotKey } from "@/types/outfit";

interface OutfitSlotProps {
  slotKey: OutfitSlotKey;
  label: string;
  item: OutfitItem | null;
  onSelect: () => void;
  isGenerating?: boolean;
}

export function OutfitSlot({
  slotKey: _slotKey,
  label,
  item,
  onSelect,
  isGenerating,
}: OutfitSlotProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl overflow-hidden transition-all duration-300 active:scale-[0.98]",
        item
          ? "kit-thumb"
          : "border-2 border-dashed border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-surface))] hover:border-[hsl(var(--sidebar-accent)/0.6)] hover:bg-[hsl(var(--sidebar-accent)/0.05)]",
        isGenerating && "animate-pulse"
      )}
    >
      {item ? (
        <>
          <div className="w-full aspect-[3/4]">
            <img
              src={item.clothingItem.imageUrl}
              alt={item.clothingItem.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent p-2">
            <p className="text-xs text-white font-medium truncate">
              {item.clothingItem.name}
            </p>
            <p className="text-[10px] text-white/70 capitalize">{label}</p>
          </div>
        </>
      ) : (
        <div className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-2 p-4">
          <div className="kit-icon-box">
            <Plus className="w-[18px] h-[18px]" />
          </div>
          <span className="text-xs kit-muted font-medium">{label}</span>
        </div>
      )}
    </button>
  );
}
