import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { BudgetSlider } from "@/components/shopping/BudgetSlider";
import { StyleTagSelector } from "@/components/shopping/StyleTagSelector";
import { RecommendationCard } from "@/components/shopping/RecommendationCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useShoppingStore } from "@/stores/useShoppingStore";

export default function ShoppingPage() {
  const { budget, selectedStyles, loadRecommendations, setBudget, toggleStyle, dismissRecommendation, getFilteredRecommendations } = useShoppingStore();

  useEffect(() => { loadRecommendations(); }, [loadRecommendations]);

  const filtered = getFilteredRecommendations();

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

        <div>
          <div className="flex items-end justify-between mb-3 gap-4">
            <div>
              <p className="kit-overline">For you</p>
              <h3 className="kit-display text-2xl md:text-3xl mt-1.5">
                Recommendations
              </h3>
            </div>
            <span className="text-sm kit-muted">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onDismiss={dismissRecommendation}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="No recommendations"
              description="Try adjusting your budget or style preferences"
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
