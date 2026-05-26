import { api } from "@/lib/api";
import type { ShoppingRecommendation, StylePreference } from "@/types/shopping";

interface RecommendationsResponse {
  recommendations: ShoppingRecommendation[];
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
};
