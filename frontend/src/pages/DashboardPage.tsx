import { useEffect, useState } from "react";
import { Shirt, Layers, DollarSign, TrendingUp } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOutfitCarousel } from "@/components/dashboard/RecentOutfitCarousel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ClothingUploadDialog } from "@/components/wardrobe/ClothingUploadDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { useOutfitStore } from "@/stores/useOutfitStore";
import { useUserStore } from "@/stores/useUserStore";
import { useShoppingStore } from "@/stores/useShoppingStore";

export default function DashboardPage() {
  const { items, loadItems } = useWardrobeStore();
  const { outfits, loadOutfits } = useOutfitStore();
  const user = useUserStore((s) => s.user);
  const budget = useShoppingStore((s) => s.budget);
  const loadRecommendations = useShoppingStore((s) => s.loadRecommendations);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadItems();
    loadOutfits();
    loadRecommendations();
  }, [loadItems, loadOutfits, loadRecommendations]);

  const remaining = budget.monthlyBudget - budget.spent;
  const recentItems = items.filter((i) => {
    const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(i.createdAt).getTime() > week;
  });

  return (
    <PageContainer>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground mt-1">Here's your style overview</p>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Shirt} title="Start building your wardrobe" description="Upload your first clothing item to get started with AI-powered styling" action={{ label: "Add First Item", onClick: () => setShowUpload(true) }} />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Shirt} label="Total Items" value={items.length} />
            <StatCard icon={Layers} label="Outfits" value={outfits.length} />
            <StatCard icon={DollarSign} label="Budget Left" value={`$${remaining}`} subtitle={`of $${budget.monthlyBudget}`} />
            <StatCard icon={TrendingUp} label="This Week" value={recentItems.length} subtitle="items added" />
          </div>

          <RecentOutfitCarousel outfits={outfits} />
          <QuickActions onUploadClick={() => setShowUpload(true)} />
        </div>
      )}

      <ClothingUploadDialog open={showUpload} onClose={() => setShowUpload(false)} />
    </PageContainer>
  );
}
