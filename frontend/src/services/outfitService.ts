import { api } from "@/lib/api";
import type { Outfit, OutfitGenerationRequest } from "@/types/outfit";

export const outfitService = {
  async generate(params: OutfitGenerationRequest): Promise<Outfit> {
    const res = await api.post<{ outfit: Outfit }>("/outfits/generate", params);
    return res.outfit;
  },

  async getAll(params?: { occasion?: string; collection?: string }): Promise<Outfit[]> {
    const query = new URLSearchParams();
    if (params?.occasion) query.set("occasion", params.occasion);
    if (params?.collection) query.set("collection", params.collection);
    const qs = query.toString();
    const res = await api.get<{ outfits: Outfit[]; count: number }>(`/outfits${qs ? `?${qs}` : ''}`);
    return res.outfits;
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(`/outfits/${id}`);
  },

  async confirm(id: string, collection?: string): Promise<Outfit> {
    return api.patch<Outfit>(`/outfits/${id}/confirm`, { collection });
  },
};
