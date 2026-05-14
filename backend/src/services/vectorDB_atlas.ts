import type { VectorDB } from './embeddingService';

/**
 * Atlas Vector Search implementation using $vectorSearch aggregation.
 * Requires a search index on the 'wardrobeitems' collection with:
 *   { mappings: { fields: { embedding: { type: "knnVector", dimensions: 1536, similarity: "cosine" } } } }
 *
 * Falls back to memoryVectorDB if $vectorSearch is not available (e.g., local MongoDB).
 */
export const atlasVectorDB: VectorDB = {
  async search(
    queryEmbedding: number[],
    filter: Record<string, unknown>,
    limit: number,
    userId: string
  ): Promise<{ id: string; score: number }[]> {
    const mongoose = require('mongoose');
    const collection = mongoose.connection.collection('wardrobeitems');

    const atlasFilter: Record<string, unknown> = { userId, ...filter };

    try {
      const results = await collection.aggregate([
        {
          $vectorSearch: {
            index: 'vector_index',
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: limit * 5,
            limit,
            filter: atlasFilter,
          },
        },
        {
          $project: {
            _id: 0,
            id: { $toString: '$_id' },
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ]).toArray();

      return results.map((r: any) => ({ id: r.id, score: r.score }));
    } catch (_err) {
      // Fall back to in-memory if Atlas vector search fails (e.g., not configured)
      const { memoryVectorDB } = require('./vectorDB_memory');
      return memoryVectorDB.search(queryEmbedding, filter, limit, userId);
    }
  },

  async indexItems(
    _items: { id: string; embedding: number[] }[]
  ): Promise<void> {
    // Atlas handles indexing automatically via the search index definition.
    // Individual document updates happen through the wardrobe route save.
  },
};
