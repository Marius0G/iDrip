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
        <h2 className="text-2xl font-bold">Smart Shopping</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-powered recommendations for your wardrobe</p>
      </div>

      <div className="space-y-6">
        <BudgetSlider budget={budget.monthlyBudget} spent={budget.spent} currency={budget.currency} onChange={(v) => setBudget({ monthlyBudget: v })} />

        <div>
          <h3 className="text-sm font-medium mb-2">Style Preferences</h3>
          <StyleTagSelector selected={selectedStyles} onToggle={toggleStyle} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            <span className="text-sm text-muted-foreground">{filtered.length} items</span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} onDismiss={dismissRecommendation} />
              ))}
            </div>
          ) : (
            <EmptyState icon={ShoppingBag} title="No recommendations" description="Try adjusting your budget or style preferences" />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
