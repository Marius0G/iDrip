import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 3000;

export interface AIRecommendationRequest {
  user_id: string;
  wardrobe_items: Record<string, unknown>[];
  preferences: {
    styles: string[];
    favorite_colors: string[];
    budget_min: number;
    budget_max: number;
    sizes?: { top?: string; bottom?: string; shoes?: string };
  };
}

export interface AIRecommendation {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string;
  matchScore: number;
  matchReason: string;
  description?: string;
  tags?: string[];
  productUrl?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateRecommendationsAI(
  request: AIRecommendationRequest
): Promise<AIRecommendation[]> {
  let lastError: Error | null = null;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.AI_SERVICE_TOKEN) {
    headers['X-Internal-Token'] = process.env.AI_SERVICE_TOKEN;
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/recommend-purchases`,
        request,
        { headers, timeout: 120000 }
      );

      const recs = response.data?.recommendations;
      if (!Array.isArray(recs)) {
        console.warn('[aiRecommendations] Unexpected response shape:', JSON.stringify(response.data).slice(0, 200));
        return [];
      }
      return recs;
    } catch (err: any) {
      lastError = err;
      const status = err.response?.status;

      if (err.response) {
        console.error('[aiRecommendations] Error response:', status, JSON.stringify(err.response.data).slice(0, 200));
      } else {
        console.error('[aiRecommendations] Request failed:', err.message);
      }

      if (attempt >= MAX_RETRIES) break;
      // Don't retry client errors or timeouts — they won't fix themselves.
      if (status && status >= 400 && status < 500) break;
      if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') break;

      await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
    }
  }

  if ((lastError as any)?.code === 'ECONNREFUSED') {
    throw new Error('AI recommendation service is not available');
  }
  if ((lastError as any)?.code === 'ECONNABORTED' || (lastError as any)?.code === 'ETIMEDOUT') {
    throw new Error('AI recommendation timed out — please try again');
  }
  throw lastError || new Error('AI recommendation failed');
}
