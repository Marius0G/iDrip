import { api } from "@/lib/api";
import type { ShoppingRecommendation, StylePreference } from "@/types/shopping";

interface RecommendationsResponse {
  recommendations: ShoppingRecommendation[];
  count: number;
}

interface SavedResponse {
  saved: ShoppingRecommendation[];
  count: number;
}

interface HiddenResponse {
  hidden: (ShoppingRecommendation & { stableKey: string })[];
  count: number;
}

export const shoppingService = {
  async getRecommendations(params: {
    budget?: number;
    styles?: StylePreference[];
    force?: boolean;
  } = {}): Promise<ShoppingRecommendation[]> {
    const q = new URLSearchParams();
    if (typeof params.budget === "number") q.set("budget", String(params.budget));
    if (params.styles && params.styles.length) q.set("style", params.styles.join(","));
    if (params.force) q.set("force", "1");
    const path = `/recommendations${q.toString() ? `?${q.toString()}` : ""}`;
    const res = await api.get<RecommendationsResponse>(path);
    return res.recommendations;
  },

  async clearCache(): Promise<number> {
    const res = await api.delete<{ deleted: number }>("/recommendations/cache");
    return res.deleted;
  },

  async saveItem(item: ShoppingRecommendation): Promise<void> {
    await api.post<{ saved: { stableKey: string; savedAt: string } }>("/recommendations/save", { item });
  },

  async getSaved(): Promise<ShoppingRecommendation[]> {
    const res = await api.get<SavedResponse>("/recommendations/saved");
    return res.saved;
  },

  async hideItem(stableKey: string, item?: ShoppingRecommendation): Promise<void> {
    // Soft dismiss — appears in Hidden tab, user can Restore later.
    await api.delete<void>("/recommendations/item", { stableKey, item, permanent: false });
  },

  async deleteItem(stableKey: string, item?: ShoppingRecommendation): Promise<void> {
    // Permanent dismiss — never re-surfaces, not in Hidden tab.
    await api.delete<void>("/recommendations/item", { stableKey, item, permanent: true });
  },

  async getHidden(): Promise<(ShoppingRecommendation & { stableKey: string })[]> {
    const res = await api.get<HiddenResponse>("/recommendations/hidden");
    return res.hidden;
  },

  async restoreHidden(stableKey: string): Promise<void> {
    await api.post<void>(`/recommendations/hidden/${encodeURIComponent(stableKey)}/restore`);
  },

  async deleteHiddenForever(stableKey: string): Promise<void> {
    await api.post<void>(`/recommendations/hidden/${encodeURIComponent(stableKey)}/delete-forever`);
  },
};
