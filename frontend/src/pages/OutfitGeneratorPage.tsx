import { useEffect, useState, useCallback } from "react";
import { Wand2, Layers, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { OutfitBuilder } from "@/components/outfit/OutfitBuilder";
import { GenerateButton } from "@/components/outfit/GenerateButton";
import { OutfitGrid } from "@/components/outfit/OutfitGrid";
import { OutfitPreviewModal } from "@/components/outfit/OutfitPreviewModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { useOutfitStore } from "@/stores/useOutfitStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { OCCASION_OPTIONS, WEATHER_OPTIONS } from "@/data/styles";
import { SEASONS } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { OutfitOccasion, OutfitSlotKey, Weather } from "@/types/outfit";
import type { Season } from "@/types/wardrobe";

export default function OutfitGeneratorPage() {
  const {
    outfits,
    currentBuild,
    pendingOutfit,
    isGenerating,
    error,
    loadOutfits,
    generateOutfit,
    confirmOutfit,
    regenerateOutfit,
    dismissPreview,
    deleteOutfit,
  } = useOutfitStore();
  const { items, loadItems } = useWardrobeStore();
  const [activeTab, setActiveTab] = useState<"builder" | "saved">("builder");
  const [occasion, setOccasion] = useState<OutfitOccasion>("casual");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [season, setSeason] = useState<Season>("all");
  const [freeText, setFreeText] = useState("");

  useEffect(() => {
    loadItems();
    loadOutfits();
  }, [loadItems, loadOutfits]);

  const currentParams = {
    occasion: occasion || undefined,
    weather: weather || undefined,
    season: season !== "all" ? season : undefined,
    free_text: freeText || undefined,
  };

  const handleGenerate = useCallback(async () => {
    if (items.length < 3) return;
    try {
      await generateOutfit(currentParams);
    } catch (_) {
      // Error is set in the store
    }
  }, [items, generateOutfit, occasion, weather, season, freeText]);

  const handleSurpriseMe = useCallback(async () => {
    setOccasion("casual");
    setWeather(null);
    setSeason("all");
    setFreeText("");
    try {
      await generateOutfit({});
    } catch (_) {
      // Error is set in the store
    }
  }, [generateOutfit]);

  const handleConfirm = useCallback(
    async (outfit: typeof pendingOutfit extends null ? never : NonNullable<typeof pendingOutfit>) => {
      if (!outfit) return;
      const collection = outfit.collectionName?.trim() || undefined;
      await confirmOutfit(outfit.id, collection);
    },
    [confirmOutfit]
  );

  const handleRegenerate = useCallback(
    async (feedback: string) => {
      try {
        await regenerateOutfit(feedback, currentParams);
      } catch (_) {
        // Error is set in the store
      }
    },
    [regenerateOutfit, occasion, weather, season, freeText]
  );

  const handleSlotClick = useCallback((_slot: OutfitSlotKey) => {
    // Future: manual slot editing
  }, []);

  const hasEnoughItems =
    items.filter((i) => i.category === "tops").length > 0 &&
    items.filter((i) => i.category === "bottoms").length > 0 &&
    items.filter((i) => i.category === "shoes").length > 0;

  const latestReasoning = pendingOutfit?.aiReasoning || outfits[0]?.aiReasoning;

  return (
    <PageContainer noTopPadding>
      <div className="mb-8">
        <p className="text-overline mb-2">
          AI STUDIO<span className="text-[hsl(var(--punctuation))]">.</span>
        </p>
        <h2 className="text-display text-4xl md:text-5xl text-[hsl(var(--peak))] mb-2">
          Outfit Generator
        </h2>
        <p className="text-base text-muted-foreground">
          AI-powered combinations<span className="text-[hsl(var(--punctuation))]">.</span>
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-[hsl(var(--frost))] mb-6 w-fit">
        {[
          { key: "builder" as const, label: "Builder" },
          { key: "saved" as const, label: `Saved (${outfits.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-[hsl(var(--frost)/0.9)] shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "builder" ? (
        <div className="space-y-6">
          {/* Occasion selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Occasion<span className="text-[hsl(var(--punctuation))]">:</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {OCCASION_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setOccasion(o.value as OutfitOccasion)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    occasion === o.value
                      ? "bg-[hsl(var(--glacier))] text-white border-transparent"
                      : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)] hover:bg-[hsl(var(--frost))]"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weather selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Weather <span className="text-xs text-muted-foreground">(optional)</span>
              <span className="text-[hsl(var(--punctuation))]">:</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {WEATHER_OPTIONS.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setWeather(weather === w.value ? null : w.value as Weather)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    weather === w.value
                      ? "bg-[hsl(var(--glacier))] text-white border-transparent"
                      : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)] hover:bg-[hsl(var(--frost))]"
                  )}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Season selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Season<span className="text-[hsl(var(--punctuation))]">:</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {SEASONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSeason(s.value as Season)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    season === s.value
                      ? "bg-[hsl(var(--glacier))] text-white border-transparent"
                      : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)] hover:bg-[hsl(var(--frost))]"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Free-text input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Custom request <span className="text-xs text-muted-foreground">(optional)</span>
              <span className="text-[hsl(var(--punctuation))]">:</span>
            </label>
            <input
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g., I want something with a pop of red, cozy evening vibe..."
              className="w-full px-4 py-3 rounded-xl bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
            />
          </div>

          {/* Outfit Builder Slots */}
          <OutfitBuilder
            currentBuild={currentBuild}
            onSlotClick={handleSlotClick}
            isGenerating={isGenerating}
          />

          {/* Error banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* AI Reasoning */}
          {currentBuild.top && !isGenerating && (
            <div className="bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] rounded-2xl p-4 shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)]">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">AI Reasoning</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {latestReasoning || "Generate an outfit to see AI reasoning."}
              </p>
            </div>
          )}

          {/* Generate + Surprise Me buttons */}
          <div className="space-y-3">
            <GenerateButton
              onClick={handleGenerate}
              isGenerating={isGenerating}
              disabled={!hasEnoughItems}
            />

            <button
              onClick={handleSurpriseMe}
              disabled={isGenerating || items.length < 3}
              className="w-full py-3 rounded-2xl border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--frost)/0.5)] text-sm font-medium hover:bg-[hsl(var(--frost))] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Surprise Me
            </button>
          </div>

          {!hasEnoughItems && (
            <p className="text-xs text-muted-foreground text-center">
              Add at least 1 top, 1 bottom, and 1 pair of shoes to generate outfits.
            </p>
          )}
        </div>
      ) : (
        <div>
          {outfits.length > 0 ? (
            <OutfitGrid outfits={outfits} onDelete={deleteOutfit} />
          ) : (
            <EmptyState
              icon={Layers}
              title="No saved outfits"
              description="Generate your first outfit using the builder tab"
              action={{ label: "Go to Builder", onClick: () => setActiveTab("builder") }}
            />
          )}
        </div>
      )}

      {/* Preview Modal */}
      <OutfitPreviewModal
        open={pendingOutfit !== null}
        outfit={pendingOutfit}
        onConfirm={handleConfirm}
        onRegenerate={handleRegenerate}
        onDismiss={dismissPreview}
        isRegenerating={isGenerating}
      />
    </PageContainer>
  );
}
