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

export function OutfitSlot({ slotKey: _slotKey, label, item, onSelect, isGenerating }: OutfitSlotProps) {
  return (
    <button onClick={onSelect} className={cn(
      "relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 overflow-hidden active:scale-[0.98] touch-press",
      item
        ? "border-[hsl(var(--border)/0.4)] bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl shadow-lg"
        : "border-dashed border-[hsl(var(--border)/0.5)] hover:border-[hsl(var(--glacier)/0.5)] bg-[hsl(var(--frost)/0.4)]",
      isGenerating && "animate-pulse"
    )}>
      {item ? (
        <>
          <div className="w-full aspect-[3/4]">
            <img src={item.clothingItem.imageUrl} alt={item.clothingItem.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <p className="text-xs text-white font-medium truncate">{item.clothingItem.name}</p>
            <p className="text-[10px] text-white/70 capitalize">{label}</p>
          </div>
        </>
      ) : (
        <div className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--frost))] flex items-center justify-center">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">{label}</span>
        </div>
      )}
    </button>
  );
}
