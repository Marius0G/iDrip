import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, DollarSign, Trash2, Shirt, Crown } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StyleTagSelector } from "@/components/shopping/StyleTagSelector";
import { useUserStore } from "@/stores/useUserStore";
import { useShoppingStore } from "@/stores/useShoppingStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import type { StylePreference } from "@/types/shopping";

export default function ProfilePage() {
  const { user, updateStylePreferences, updateBudget, clearAllData } = useUserStore();
  const { items, loadItems } = useWardrobeStore();
  const toggleStyle = useShoppingStore((s) => s.toggleStyle);
  const selectedStyles = useShoppingStore((s) => s.selectedStyles);
  const { currentSubscription, fetchCurrentSubscription, openCustomerPortal } = useSubscriptionStore();

  useEffect(() => { loadItems(); }, [loadItems]);
  useEffect(() => { fetchCurrentSubscription(); }, [fetchCurrentSubscription]);

  const categories = ["tops", "bottoms", "shoes", "outerwear", "accessories"] as const;
  const categoryCounts = categories.map((c) => ({
    name: c,
    count: items.filter((i) => i.category === c).length,
  }));

  return (
    <PageContainer>
      <div className="mb-5 md:mb-6">
        <p className="kit-overline">Your</p>
        <h2 className="kit-display text-2xl md:text-4xl mt-1.5">Profile</h2>
        <p className="text-sm kit-muted mt-2">Manage your preferences</p>
      </div>

      <div className="max-w-5xl">
        <div className="grid gap-4 md:gap-5 md:grid-cols-2">
          {/* Hero — user info, full width */}
          <div className="kit-card p-4 md:p-5 md:col-span-2">
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className="kit-icon-box kit-icon-box-accent flex-shrink-0 text-xl md:text-[22px]"
                style={{ width: 56, height: 56, borderRadius: 16, fontWeight: 700 }}
              >
                {user?.name?.charAt(0) || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="kit-overline">Signed in as</p>
                <h3 className="font-display text-xl md:text-2xl font-semibold kit-strong truncate mt-0.5">
                  {user?.name || "User"}
                </h3>
                <p className="text-xs md:text-sm kit-muted truncate">{user?.email || ""}</p>
                {currentSubscription && (
                  <div className="mt-2 inline-flex md:hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-lg border border-[hsl(var(--sidebar-border))]">
                    <Crown className="w-3 h-3 text-[hsl(var(--sidebar-accent))]" />
                    <span className="kit-strong">{currentSubscription.tier}</span>
                  </div>
                )}
              </div>

              {currentSubscription && (
                <div className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-[hsl(var(--sidebar-border))]">
                  <Crown className="w-3.5 h-3.5 text-[hsl(var(--sidebar-accent))]" />
                  <span className="kit-strong">{currentSubscription.tier}</span>
                </div>
              )}
            </div>
          </div>

          {/* Subscription */}
          {currentSubscription && (
            <div className="kit-card p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-4 h-4 text-[hsl(var(--sidebar-accent))]" />
                <span className="kit-overline">Subscription</span>
              </div>

              {currentSubscription.tier === "free" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm kit-muted">Current Plan</span>
                    <span className="text-sm font-medium kit-strong">Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm kit-muted">AI Generations</span>
                    <span className="text-sm font-medium kit-strong">
                      {currentSubscription.generationsRemaining} / 5 left
                    </span>
                  </div>
                  <Link
                    to="/subscription"
                    className="kit-btn-primary w-full justify-center mt-1"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm kit-muted">Plan</span>
                    <span className="text-sm font-medium capitalize kit-strong">
                      {currentSubscription.tier}
                    </span>
                  </div>
                  {currentSubscription.status && currentSubscription.status !== "active" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm kit-muted">Status</span>
                      <span className="text-sm font-medium capitalize kit-strong">
                        {currentSubscription.status}
                      </span>
                    </div>
                  )}
                  {currentSubscription.tier !== "lifetime" && currentSubscription.expiry && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm kit-muted">Renews</span>
                      <span className="text-sm font-medium kit-strong">
                        {new Date(currentSubscription.expiry).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={openCustomerPortal}
                    className="kit-btn-secondary w-full justify-center"
                  >
                    Manage Subscription
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Budget */}
          <div className="kit-card p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-[hsl(var(--sidebar-accent))]" />
              <span className="kit-overline">Monthly Budget</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm kit-muted">$</span>
              <input
                type="number"
                value={user?.budget?.monthlyBudget || 150}
                onChange={(e) => updateBudget(Number(e.target.value))}
                min={0}
                max={1000}
                className="kit-input flex-1"
                inputMode="numeric"
              />
              <span className="text-sm kit-muted whitespace-nowrap">/ month</span>
            </div>
          </div>

          {/* Style Preferences — full width */}
          <div className="kit-card p-4 md:p-5 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-[hsl(var(--sidebar-accent))]" />
              <span className="kit-overline">Style Preferences</span>
            </div>
            <StyleTagSelector
              className="mx-0 px-0"
              selected={selectedStyles}
              onToggle={(style: StylePreference) => {
                toggleStyle(style);
                const newStyles = selectedStyles.includes(style)
                  ? selectedStyles.filter((s) => s !== style)
                  : [...selectedStyles, style];
                updateStylePreferences(newStyles);
              }}
            />
          </div>

          {/* Wardrobe Stats — full width */}
          <div className="kit-card p-4 md:p-5 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shirt className="w-4 h-4 text-[hsl(var(--sidebar-accent))]" />
              <span className="kit-overline">Wardrobe Breakdown</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {categoryCounts.map((cat) => {
                const pct = items.length ? (cat.count / items.length) * 100 : 0;
                return (
                  <div key={cat.name} className="space-y-1.5 md:space-y-0 md:flex md:items-center md:gap-3">
                    <div className="flex items-center justify-between md:contents">
                      <span className="text-sm capitalize kit-muted md:w-24 md:flex-shrink-0">
                        {cat.name}
                      </span>
                      <span className="text-sm font-medium kit-strong md:order-last md:w-6 md:text-right">
                        {cat.count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[hsl(var(--sidebar-surface))] border border-[hsl(var(--sidebar-border))] overflow-hidden md:flex-1">
                      <div
                        className="h-full rounded-full bg-[hsl(var(--sidebar-accent))] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Danger Zone — outside grid, full width */}
        <div className="mt-4 md:mt-5 rounded-xl p-4 md:p-5 border border-[hsl(var(--sidebar-danger)/0.4)] bg-[hsl(var(--sidebar-danger)/0.05)]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
            <div className="min-w-0">
              <h3 className="kit-overline" style={{ color: "hsl(var(--sidebar-danger))" }}>
                Danger Zone
              </h3>
              <p className="text-xs kit-muted mt-2 max-w-md">
                This will clear all your wardrobe data, outfits, and preferences.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure? This will clear all your data.")) {
                  clearAllData();
                }
              }}
              className="self-start inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors border-[hsl(var(--sidebar-danger)/0.4)] text-[hsl(var(--sidebar-danger))] hover:bg-[hsl(var(--sidebar-danger)/0.1)]"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Data
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
