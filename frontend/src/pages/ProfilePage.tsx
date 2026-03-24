import { useEffect } from "react";
import { Palette, DollarSign, Sun, Moon, Monitor, Trash2, Shirt } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { GlassCard } from "@/components/glass/GlassCard";
import { StyleTagSelector } from "@/components/shopping/StyleTagSelector";
import { useUserStore } from "@/stores/useUserStore";
import { useShoppingStore } from "@/stores/useShoppingStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { cn } from "@/lib/utils";
import type { StylePreference } from "@/types/shopping";

export default function ProfilePage() {
  const { user, updateStylePreferences, updateBudget, setTheme, clearAllData } = useUserStore();
  const { items, loadItems } = useWardrobeStore();
  const toggleStyle = useShoppingStore((s) => s.toggleStyle);
  const selectedStyles = useShoppingStore((s) => s.selectedStyles);

  useEffect(() => { loadItems(); }, [loadItems]);

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
    <PageContainer>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* User info */}
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </GlassCard>

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
              value={user.budget.monthlyBudget}
              onChange={(e) => updateBudget(Number(e.target.value))}
              min={0}
              max={1000}
              className="w-32 px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
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
                  user.theme === option.value
                    ? "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md"
                    : "bg-white/50 dark:bg-white/5 text-muted-foreground border-white/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
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
                  <div className="w-24 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-black dark:bg-white transition-all duration-500"
                      style={{ width: `${items.length ? (cat.count / items.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard className="border-red-200/50 dark:border-red-900/30">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
          <p className="text-xs text-muted-foreground mb-4">This will clear all your wardrobe data, outfits, and preferences.</p>
          <button
            onClick={() => {
              if (window.confirm("Are you sure? This will clear all your data.")) {
                clearAllData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All Data
          </button>
        </GlassCard>
      </div>
    </PageContainer>
  );
}
