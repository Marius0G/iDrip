import { useEffect, useState, useCallback } from "react";
import {
  Wand2,
  Layers,
  Flower,
  Sun,
  Leaf,
  Snowflake,
  Coffee,
  Briefcase,
  Crown,
  Heart,
  Dumbbell,
  Plane,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { OutfitBuilder } from "@/components/outfit/OutfitBuilder";
import { GenerateButton } from "@/components/outfit/GenerateButton";
import { OutfitGrid } from "@/components/outfit/OutfitGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { OptionWheel, type WheelOption } from "@/components/shared/OptionWheel";
import { useOutfitStore } from "@/stores/useOutfitStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { cn } from "@/lib/utils";
import type { OutfitOccasion, OutfitSlotKey } from "@/types/outfit";
import type { Season } from "@/types/wardrobe";

const OCCASION_WHEEL: WheelOption<OutfitOccasion>[] = [
  { value: "casual", label: "Casual", Icon: Coffee },
  { value: "work", label: "Work", Icon: Briefcase },
  { value: "formal", label: "Formal", Icon: Crown },
  { value: "date", label: "Date", Icon: Heart },
  { value: "sport", label: "Sport", Icon: Dumbbell },
  { value: "travel", label: "Travel", Icon: Plane },
];

const SEASON_WHEEL: WheelOption<Season>[] = [
  { value: "spring", label: "Spring", Icon: Flower },
  { value: "summer", label: "Summer", Icon: Sun },
  { value: "fall", label: "Fall", Icon: Leaf },
  { value: "winter", label: "Winter", Icon: Snowflake },
];

export default function OutfitGeneratorPage() {
  const { outfits, currentBuild, isGenerating, loadOutfits, generateOutfit, deleteOutfit } = useOutfitStore();
  const { items, loadItems } = useWardrobeStore();
  const [activeTab, setActiveTab] = useState<"builder" | "saved">("builder");
  const [occasion, setOccasion] = useState<OutfitOccasion>("casual");
  const [season, setSeason] = useState<Season>("all");

  useEffect(() => { loadItems(); loadOutfits(); }, [loadItems, loadOutfits]);

  const handleGenerate = useCallback(async () => {
    if (items.length < 3) return;
    await generateOutfit(occasion, season, items);
  }, [occasion, season, items, generateOutfit]);

  const handleSlotClick = useCallback((_slot: OutfitSlotKey) => {
    // For now, just clear the slot on click
  }, []);

  const hasEnoughItems = items.filter((i) => i.category === "tops").length > 0 &&
    items.filter((i) => i.category === "bottoms").length > 0 &&
    items.filter((i) => i.category === "shoes").length > 0;

  const latestReasoning = outfits[0]?.aiReasoning;

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="kit-overline">Outfit</p>
        <h2 className="kit-display text-3xl md:text-4xl mt-1.5">Generator</h2>
        <p className="text-sm kit-muted mt-2">AI-powered outfit combos</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6 md:flex md:w-fit">
        {[
          { key: "builder" as const, label: "Builder" },
          { key: "saved" as const, label: `Saved (${outfits.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "kit-chip justify-center w-full md:w-auto",
              activeTab === tab.key && "kit-chip-active"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "builder" ? (
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div className="flex flex-col items-center gap-3">
              <p className="kit-overline self-center">Occasion</p>
              <OptionWheel
                options={OCCASION_WHEEL}
                value={occasion}
                onChange={(v) => setOccasion(v)}
                size={280}
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="kit-overline self-center">Season</p>
              <OptionWheel
                options={SEASON_WHEEL}
                value={season}
                onChange={setSeason}
                center={{ value: "all", label: "All" }}
                size={260}
              />
            </div>
          </div>

          <OutfitBuilder currentBuild={currentBuild} onSlotClick={handleSlotClick} isGenerating={isGenerating} />

          {currentBuild.top && !isGenerating && (
            <div className="kit-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-4 h-4 text-[hsl(var(--sidebar-accent))]" />
                <span className="kit-overline">AI Reasoning</span>
              </div>
              <p className="text-sm kit-muted leading-relaxed">
                {latestReasoning || "Generate an outfit to see AI reasoning."}
              </p>
            </div>
          )}

          <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} disabled={!hasEnoughItems} />

          {!hasEnoughItems && (
            <p className="text-xs kit-muted text-center">
              Add at least 1 top, 1 bottom, and 1 pair of shoes to generate outfits.
            </p>
          )}
        </div>
      ) : (
        <div>
          {outfits.length > 0 ? (
            <OutfitGrid outfits={outfits} onDelete={deleteOutfit} />
          ) : (
            <EmptyState icon={Layers} title="No saved outfits" description="Generate your first outfit using the builder tab" action={{ label: "Go to Builder", onClick: () => setActiveTab("builder") }} />
          )}
        </div>
      )}
    </PageContainer>
  );
}
