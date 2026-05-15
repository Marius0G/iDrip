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

const hour = new Date().getHours();
const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

export default function DashboardPage() {
  const { items, loadItems } = useWardrobeStore();
  const { outfits, loadOutfits } = useOutfitStore();
  const user = useUserStore((s) => s.user);
  const budget = useShoppingStore((s) => s.budget);
  const loadRecommendations = useShoppingStore((s) => s.loadRecommendations);
  const [showUpload, setShowUpload] = useState(false);
  const [weekAgo] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    loadItems();
    loadOutfits();
    loadRecommendations();
  }, [loadItems, loadOutfits, loadRecommendations]);

  const remaining = budget.monthlyBudget - budget.spent;
  const recentItems = items.filter(
    (i) => new Date(i.createdAt).getTime() > weekAgo
  );

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="kit-overline">Good {timeOfDay}</p>
        <h2 className="kit-display text-3xl md:text-4xl mt-2">
          {user?.name?.split(" ")[0] || "User"}
          <span className="kit-display ml-1 text-[hsl(var(--sidebar-accent))]">.</span>
        </h2>
        <p className="text-sm kit-muted mt-3">Here's your style overview</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Shirt}
          title="Start building your wardrobe"
          description="Upload your first clothing item to get started with AI-powered styling"
          action={{ label: "Add First Item", onClick: () => setShowUpload(true) }}
        />
      ) : (
        <div className="space-y-10">
          <section className="animate-frost-reveal stagger-1">
            <p className="text-overline mb-4">
              AT A GLANCE
              <span className="text-[hsl(var(--punctuation))]">.</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Shirt} label="Total Items" value={items.length} />
              <StatCard icon={Layers} label="Outfits" value={outfits.length} />
              <StatCard
                icon={DollarSign}
                label="Budget Left"
                value={`$${remaining}`}
                subtitle={`of $${budget.monthlyBudget}`}
              />
              <StatCard
                icon={TrendingUp}
                label="This Week"
                value={recentItems.length}
                subtitle="items added"
              />
            </div>
          </section>

          {outfits.length > 0 && (
            <section className="animate-frost-reveal stagger-2">
              <p className="text-overline mb-3">
                LATEST LOOKS
                <span className="text-[hsl(var(--punctuation))]">.</span>
              </p>
              <RecentOutfitCarousel outfits={outfits} />
            </section>
          )}

          <section className="animate-frost-reveal stagger-3">
            <p className="text-overline mb-3">
              QUICK ACTIONS
              <span className="text-[hsl(var(--punctuation))]">.</span>
            </p>
            <QuickActions onUploadClick={() => setShowUpload(true)} />
          </section>
        </div>
      )}

      <ClothingUploadDialog
        open={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </PageContainer>
  );
}
