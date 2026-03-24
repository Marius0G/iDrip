import { OutfitSlot } from "./OutfitSlot";
import type { OutfitItem, OutfitSlotKey } from "@/types/outfit";

const SLOTS: { key: OutfitSlotKey; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "bottom", label: "Bottom" },
  { key: "shoes", label: "Shoes" },
  { key: "outerwear", label: "Outerwear" },
  { key: "accessory1", label: "Accessory" },
];

interface OutfitBuilderProps {
  currentBuild: Partial<Record<OutfitSlotKey, OutfitItem | null>>;
  onSlotClick: (slot: OutfitSlotKey) => void;
  isGenerating: boolean;
}

export function OutfitBuilder({ currentBuild, onSlotClick, isGenerating }: OutfitBuilderProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
      {SLOTS.map((slot) => (
        <OutfitSlot
          key={slot.key}
          slotKey={slot.key}
          label={slot.label}
          item={currentBuild[slot.key] ?? null}
          onSelect={() => onSlotClick(slot.key)}
          isGenerating={isGenerating}
        />
      ))}
    </div>
  );
}
