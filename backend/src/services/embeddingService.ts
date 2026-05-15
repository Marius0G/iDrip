import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;

export interface VectorDB {
  search(
    queryEmbedding: number[],
    filter: Record<string, unknown>,
    limit: number,
    userId: string
  ): Promise<{ id: string; score: number }[]>;
  indexItems(items: { id: string; embedding: number[] }[]): Promise<void>;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('No API key configured for embeddings — set OPENAI_API_KEY');
  }

  const response = await axios.post(
    `${OPENAI_BASE_URL}/embeddings`,
    {
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const embedding = response.data?.data?.[0]?.embedding;
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error('Invalid embedding response from OpenAI');
  }

  return embedding;
}

export function buildItemText(item: Record<string, unknown>): string {
  const parts: string[] = [];
  const fields = [
    'name', 'category', 'subcategory', 'primaryColor', 'secondaryColors',
    'colorTemperature', 'colorIntensity', 'pattern', 'material', 'texture',
    'transparency', 'printType', 'gender', 'formality', 'fit',
    'sleeveLength', 'sleeveStyle', 'neckline', 'collarType', 'cuffStyle',
    'length', 'hemStyle', 'closureType', 'rise', 'pleatStyle',
    'distressing', 'waistbandStyle', 'legOpening', 'warmthLevel',
    'waterResistance', 'hood', 'pockets', 'silhouette', 'backDetail',
    'strapStyle', 'heelHeight', 'heelStyle', 'toeStyle', 'soleType',
    'shaftHeight', 'accessoryType', 'bandWidth', 'sockHeight',
    'necklaceLength', 'hatStyle', 'earringStyle', 'tieStyle', 'watchStyle',
    'lensColor', 'lining',
  ];

  for (const field of fields) {
    const val = item[field];
    if (val === null || val === undefined || val === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    const label = field.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    const display = Array.isArray(val) ? val.join(', ') : String(val);
    parts.push(`${label}: ${display}`);
  }

  return parts.join('. ');
}

export function buildQueryText(preferences: {
  occasion?: string | null;
  weather?: string | null;
  season?: string | null;
  free_text?: string | null;
}): string {
  const parts: string[] = ['Find an outfit'];
  const occasion = preferences.occasion;
  const weather = preferences.weather;
  const season = preferences.season;
  const freeText = preferences.free_text;

  if (occasion) parts.push(`for a ${occasion} occasion`);
  if (weather) parts.push(`in ${weather} weather`);
  if (season) parts.push(`during ${season}`);
  if (freeText) parts.push(`. Additional requirements: ${freeText}`);

  if (!occasion && !weather && !season && !freeText) {
    parts.push('that is stylish and versatile for any occasion');
  }

  return parts.join(' ');
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dotProduct / denom;
}

let _vectorDB: VectorDB | null = null;

export function getVectorDB(): VectorDB {
  if (_vectorDB) return _vectorDB;

  const mode = process.env.VECTOR_DB || 'memory';
  if (mode === 'atlas') {
    const { atlasVectorDB } = require('./vectorDB_atlas');
    _vectorDB = atlasVectorDB;
  } else {
    const { memoryVectorDB } = require('./vectorDB_memory');
    _vectorDB = memoryVectorDB;
  }
  return _vectorDB!;
}
