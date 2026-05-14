import WardrobeItem from '../models/WardrobeItem';
import type { IWardrobeItem } from '../models/WardrobeItem';
import { cosineSimilarity } from './embeddingService';
import type { VectorDB } from './embeddingService';

export const memoryVectorDB: VectorDB = {
  async search(
    queryEmbedding: number[],
    filter: Record<string, unknown>,
    limit: number,
    userId: string
  ): Promise<{ id: string; score: number }[]> {
    const queryFilter: Record<string, unknown> = { userId, ...filter };
    // Only return items that have embeddings
    queryFilter.embedding = { $exists: true, $not: { $size: 0 } };

    const items: IWardrobeItem[] = await WardrobeItem.find(queryFilter).lean();

    const scored = items.map((item) => ({
      id: item._id.toString(),
      score: item.embedding?.length
        ? cosineSimilarity(queryEmbedding, item.embedding)
        : 0,
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  },

  async indexItems(
    items: { id: string; embedding: number[] }[]
  ): Promise<void> {
    const bulk = items.map(({ id, embedding }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { embedding } },
      },
    }));
    if (bulk.length > 0) {
      await WardrobeItem.bulkWrite(bulk);
    }
  },
};
