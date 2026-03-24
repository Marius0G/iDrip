import { useEffect, useState, useCallback } from "react";
import { Wand2, Layers } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { OutfitBuilder } from "@/components/outfit/OutfitBuilder";
import { GenerateButton } from "@/components/outfit/GenerateButton";
import { OutfitGrid } from "@/components/outfit/OutfitGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import { useOutfitStore } from "@/stores/useOutfitStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { OCCASION_OPTIONS } from "@/data/styles";
import { SEASONS } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { OutfitOccasion, OutfitSlotKey } from "@/types/outfit";
import type { Season } from "@/types/wardrobe";

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Outfit Generator</h2>
          <p className="text-sm text-muted-foreground mt-1">AI-powered outfit combinations</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 mb-6 w-fit">
        {[
          { key: "builder" as const, label: "Builder" },
          { key: "saved" as const, label: `Saved (${outfits.length})` },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-white dark:bg-black shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "builder" ? (
        <div className="space-y-6">
          {/* Occasion selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Occasion</label>
            <div className="flex gap-2 flex-wrap">
              {OCCASION_OPTIONS.map((o) => (
                <button key={o.value} onClick={() => setOccasion(o.value as OutfitOccasion)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    occasion === o.value
                      ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                      : "bg-white/50 dark:bg-white/5 text-muted-foreground border-white/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                  )}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Season selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Season</label>
            <div className="flex gap-2 flex-wrap">
              {SEASONS.map((s) => (
                <button key={s.value} onClick={() => setSeason(s.value as Season)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    season === s.value
                      ? "bg-black text-white dark:bg-white dark:text-black border-transparent"
                      : "bg-white/50 dark:bg-white/5 text-muted-foreground border-white/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Builder Slots */}
          <OutfitBuilder currentBuild={currentBuild} onSlotClick={handleSlotClick} isGenerating={isGenerating} />

          {/* AI Reasoning */}
          {currentBuild.top && !isGenerating && (
            <div className="bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">AI Reasoning</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {latestReasoning || "Generate an outfit to see AI reasoning."}
              </p>
            </div>
          )}

          {/* Generate button */}
          <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} disabled={!hasEnoughItems} />

          {!hasEnoughItems && (
            <p className="text-xs text-muted-foreground text-center">Add at least 1 top, 1 bottom, and 1 pair of shoes to generate outfits.</p>
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
