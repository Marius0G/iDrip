import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, DollarSign, Sun, Moon, Monitor, Trash2, Shirt, Crown } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassCard } from "@/components/glass/GlassCard";
import { StyleTagSelector } from "@/components/shopping/StyleTagSelector";
import { useUserStore } from "@/stores/useUserStore";
import { useShoppingStore } from "@/stores/useShoppingStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { useSubscriptionStore } from "@/stores/useSubscriptionStore";
import { cn } from "@/lib/utils";
import type { StylePreference } from "@/types/shopping";

export default function ProfilePage() {
  const { user, updateStylePreferences, updateBudget, setTheme, clearAllData } = useUserStore();
  const { items, loadItems } = useWardrobeStore();
  const toggleStyle = useShoppingStore((s) => s.toggleStyle);
  const selectedStyles = useShoppingStore((s) => s.selectedStyles);
  const { currentSubscription, fetchCurrentSubscription, openCustomerPortal } = useSubscriptionStore();

  useEffect(() => { loadItems(); }, [loadItems]);
  useEffect(() => { fetchCurrentSubscription(); }, [fetchCurrentSubscription]);

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  const categories = ["tops", "bottoms", "shoes", "outerwear", "accessories"] as const;
  const categoryCounts = categories.map((c) => ({
    name: c,
    count: items.filter((i) => i.category === c).length,
  }));

  return (
    <PageContainer noTopPadding>
      <div className="mb-8">
        <p className="text-overline mb-2">
          SETTINGS<span className="text-[hsl(var(--punctuation))]">.</span>
        </p>
        <h2 className="text-display text-4xl md:text-5xl text-[hsl(var(--peak))] mb-2">
          Profile
        </h2>
        <p className="text-base text-muted-foreground">
          Manage your preferences<span className="text-[hsl(var(--punctuation))]">.</span>
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* User info */}
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--glacier))] text-white flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="text-lg font-bold">{user?.name || "User"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
            </div>
          </div>
        </GlassCard>

        {/* Subscription */}
        {currentSubscription && (
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Subscription</h3>
            </div>
            {currentSubscription.tier === 'free' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <span className="text-sm font-medium capitalize">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Generations Left</span>
                  <span className="text-sm font-medium">{currentSubscription.generationsRemaining} / 5 this month</span>
                </div>
                <Link
                  to="/subscription"
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-[hsl(var(--glacier))] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Upgrade to Pro
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <span className="text-sm font-medium capitalize flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[hsl(var(--glacier))]" />
                    {currentSubscription.tier}
                  </span>
                </div>
                {currentSubscription.status && currentSubscription.status !== 'active' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm font-medium capitalize">{currentSubscription.status}</span>
                  </div>
                )}
                {currentSubscription.tier !== 'lifetime' && currentSubscription.expiry && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Renews</span>
                    <span className="text-sm font-medium">
                      {new Date(currentSubscription.expiry).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <button
                  onClick={openCustomerPortal}
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-[hsl(var(--glacier)/0.3)] text-[hsl(var(--glacier))] text-sm font-medium hover:bg-[hsl(var(--glacier)/0.06)] transition-colors"
                >
                  Manage Subscription
                </button>
              </div>
            )}
          </GlassCard>
        )}

        {/* Style Preferences */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Style Preferences</h3>
          </div>
          <StyleTagSelector
            selected={selectedStyles}
            onToggle={(style: StylePreference) => {
              toggleStyle(style);
              const newStyles = selectedStyles.includes(style)
                ? selectedStyles.filter((s) => s !== style)
                : [...selectedStyles, style];
              updateStylePreferences(newStyles);
            }}
          />
        </GlassCard>

        {/* Budget */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Monthly Budget</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">$</span>
            <input
              type="number"
              value={user?.budget?.monthlyBudget || 150}
              onChange={(e) => updateBudget(Number(e.target.value))}
              min={0}
              max={1000}
              className="w-32 px-4 py-2.5 rounded-xl bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
            />
            <span className="text-sm text-muted-foreground">per month</span>
          </div>
        </GlassCard>

        {/* Theme */}
        <GlassCard>
          <h3 className="text-sm font-semibold mb-4">Theme</h3>
          <div className="flex gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  user?.theme === option.value
                    ? "bg-[hsl(var(--glacier))] text-white border-transparent shadow-md"
                    : "bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)] hover:bg-[hsl(var(--frost))]"
                )}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Wardrobe Stats */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Wardrobe Breakdown</h3>
          </div>
          <div className="space-y-3">
            {categoryCounts.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="text-sm capitalize text-muted-foreground">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 rounded-full bg-[hsl(var(--frost))] overflow-hidden">
                    <div className="h-full rounded-full bg-[hsl(var(--glacier))] transition-all duration-500"
                      style={{ width: `${items.length ? (cat.count / items.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard className="border-[hsl(var(--punctuation)/0.3)]">
          <h3 className="text-sm font-semibold text-[hsl(var(--punctuation))] mb-2">Danger Zone</h3>
          <p className="text-xs text-muted-foreground mb-4">This will clear all your wardrobe data, outfits, and preferences.</p>
          <button
            onClick={() => {
              if (window.confirm("Are you sure? This will clear all your data.")) {
                clearAllData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[hsl(var(--punctuation)/0.3)] text-[hsl(var(--punctuation))] text-sm font-medium hover:bg-[hsl(var(--punctuation)/0.06)] transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All Data
          </button>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
