import { useEffect, useState } from "react";
import { ShoppingBag, RefreshCw, Loader2, Bookmark, EyeOff } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { BudgetSlider } from "@/components/shopping/BudgetSlider";
import { StyleTagSelector } from "@/components/shopping/StyleTagSelector";
import { RecommendationCard } from "@/components/shopping/RecommendationCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useShoppingStore } from "@/stores/useShoppingStore";
import { cn } from "@/lib/utils";

type Tab = "spotlight" | "saved" | "hidden";

export default function ShoppingPage() {
  const {
    budget,
    selectedStyles,
    isLoading,
    isSavedLoading,
    isHiddenLoading,
    error,
    saved,
    hidden,
    loadRecommendations,
    loadSaved,
    loadHidden,
    setBudget,
    toggleStyle,
    saveRecommendation,
    hideRecommendation,
    deleteRecommendation,
    restoreHidden,
    deleteHiddenForever,
    getFilteredRecommendations,
  } = useShoppingStore();

  const [tab, setTab] = useState<Tab>("spotlight");

  useEffect(() => { loadRecommendations(); }, [loadRecommendations]);
  useEffect(() => {
    if (tab === "saved") loadSaved();
    if (tab === "hidden") loadHidden();
  }, [tab, loadSaved, loadHidden]);

  const filtered = getFilteredRecommendations();
  const allRecs = useShoppingStore((s) => s.recommendations);
  const hiddenByBudget = allRecs.length - filtered.length;
  const isBudgetEmpty = filtered.length === 0 && hiddenByBudget > 0;

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="kit-overline">Smart</p>
        <h2 className="kit-display text-3xl md:text-4xl mt-1.5">Shopping</h2>
        <p className="text-sm kit-muted mt-2">
          AI-powered recommendations for your wardrobe
        </p>
      </div>

      <div className="space-y-6">
        <BudgetSlider
          budget={budget.monthlyBudget}
          spent={budget.spent}
          currency={budget.currency}
          onChange={(v) => setBudget({ monthlyBudget: v })}
        />

        <div>
          <label className="kit-overline block mb-2">Style Preferences</label>
          <StyleTagSelector selected={selectedStyles} onToggle={toggleStyle} />
        </div>

        <div role="tablist" className="inline-flex p-1 rounded-full bg-[hsl(var(--frost)/0.5)] border border-[hsl(var(--border)/0.4)]">
          {(["spotlight", "saved", "hidden"] as Tab[]).map((t) => {
            const count = t === "saved" ? saved.length : t === "hidden" ? hidden.length : 0;
            const label = t === "spotlight" ? "Spotlight" : t === "saved" ? "Saved" : "Hidden";
            return (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-1.5 text-sm rounded-full transition-colors",
                  tab === t
                    ? "bg-[hsl(var(--glacier))] text-white"
                    : "kit-muted hover:bg-[hsl(var(--frost)/0.7)]"
                )}
              >
                {label}
                {count > 0 && (
                  <span className="ml-1.5 text-xs opacity-80">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {tab === "spotlight" && (
          <SpotlightSection
            recs={filtered}
            isLoading={isLoading}
            error={error}
            hiddenByBudget={hiddenByBudget}
            isBudgetEmpty={isBudgetEmpty}
            onRefresh={() => loadRecommendations(true)}
            onSave={saveRecommendation}
            onHide={(id) => hideRecommendation(id, "spotlight")}
            onDelete={(id) => deleteRecommendation(id, "spotlight")}
          />
        )}
        {tab === "saved" && (
          <SavedSection
            saved={saved}
            isLoading={isSavedLoading}
            onHide={(id) => hideRecommendation(id, "saved")}
            onDelete={(id) => deleteRecommendation(id, "saved")}
          />
        )}
        {tab === "hidden" && (
          <HiddenSection
            hidden={hidden}
            isLoading={isHiddenLoading}
            onRestore={restoreHidden}
            onDeleteForever={deleteHiddenForever}
          />
        )}
      </div>
    </PageContainer>
  );
}

interface SpotlightSectionProps {
  recs: ReturnType<typeof useShoppingStore.getState>["recommendations"];
  isLoading: boolean;
  error: string | null;
  hiddenByBudget: number;
  isBudgetEmpty: boolean;
  onRefresh: () => void;
  onSave: (id: string) => void;
  onHide: (id: string) => void;
  onDelete: (id: string) => void;
}

function SpotlightSection({
  recs, isLoading, error, hiddenByBudget, isBudgetEmpty, onRefresh, onSave, onHide, onDelete,
}: SpotlightSectionProps) {
  return (
    <div>
      <div className="flex items-end justify-between mb-3 gap-4">
        <div>
          <p className="kit-overline">For you</p>
          <h3 className="kit-display text-2xl md:text-3xl mt-1.5">Recommendations</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm kit-muted">
            {recs.length} {recs.length === 1 ? "item" : "items"}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded-full p-2 bg-[hsl(var(--frost)/0.5)] border border-[hsl(var(--border)/0.4)] hover:bg-[hsl(var(--frost)/0.7)] disabled:opacity-50 active:scale-95 touch-press"
            aria-label="Refresh recommendations"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-[hsl(var(--punctuation)/0.3)] bg-[hsl(var(--punctuation)/0.06)] p-4 text-sm text-[hsl(var(--punctuation))]">
          {error}
        </div>
      ) : isLoading && recs.length === 0 ? (
        <div className="flex items-center justify-center py-12 kit-muted text-sm gap-2">
          <Loader2 className="size-4 animate-spin" />
          Finding pieces for you…
        </div>
      ) : isBudgetEmpty ? (
        <EmptyState
          icon={ShoppingBag}
          title={`${hiddenByBudget} ${hiddenByBudget === 1 ? "item is" : "items are"} hidden by your budget`}
          description="Raise the budget slider above to see them, or refresh to find cheaper alternatives."
        />
      ) : recs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              variant="spotlight"
              onSave={onSave}
              onHide={onHide}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No recommendations yet"
          description="Add a few wardrobe items, then refresh — the AI uses them to suggest pieces that complement your style."
        />
      )}
    </div>
  );
}

interface SavedSectionProps {
  saved: ReturnType<typeof useShoppingStore.getState>["saved"];
  isLoading: boolean;
  onHide: (id: string) => void;
  onDelete: (id: string) => void;
}

interface HiddenSectionProps {
  hidden: ReturnType<typeof useShoppingStore.getState>["hidden"];
  isLoading: boolean;
  onRestore: (stableKey: string) => void;
  onDeleteForever: (stableKey: string) => void;
}

function HiddenSection({ hidden, isLoading, onRestore, onDeleteForever }: HiddenSectionProps) {
  if (isLoading && hidden.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 kit-muted text-sm gap-2">
        <Loader2 className="size-4 animate-spin" />
        Loading hidden picks…
      </div>
    );
  }
  if (hidden.length === 0) {
    return (
      <EmptyState
        icon={EyeOff}
        title="Nothing hidden"
        description="Items you delete from Spotlight or Saved will appear here. You can restore them at any time."
      />
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {hidden.map((rec) => (
        <RecommendationCard
          key={rec.stableKey}
          recommendation={rec}
          variant="hidden"
          onRestore={() => onRestore(rec.stableKey)}
          onDelete={() => onDeleteForever(rec.stableKey)}
        />
      ))}
    </div>
  );
}

function SavedSection({ saved, isLoading, onHide, onDelete }: SavedSectionProps) {
  if (isLoading && saved.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 kit-muted text-sm gap-2">
        <Loader2 className="size-4 animate-spin" />
        Loading your saved picks…
      </div>
    );
  }
  if (saved.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Nothing saved yet"
        description="Use the bookmark icon on a card to save it here. Saved items make room for fresh picks in Spotlight."
      />
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {saved.map((rec) => (
        <RecommendationCard
          key={rec.id || rec.productUrl || rec.name}
          recommendation={rec}
          variant="saved"
          onHide={onHide}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
