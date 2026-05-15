import axios from 'axios';

export interface ClothingAnalysis {
  name: string;
  category: string;
  subcategory: string | null;
  primaryColor: string | null;
  secondaryColors: string[];
  colorTemperature: string | null;
  colorIntensity: string | null;
  pattern: string | null;
  material: string | null;
  texture: string | null;
  transparency: string | null;
  printType: string | null;
  gender: string | null;
  formality: number | null;
  occasion: string[];
  style: string[];
  season: string[];
  brand: string | null;
  tags: string[];
  fit: string | null;
  sleeveLength: string | null;
  sleeveStyle: string | null;
  neckline: string | null;
  collarType: string | null;
  cuffStyle: string | null;
  length: string | null;
  hemStyle: string | null;
  closureType: string | null;
  rise: string | null;
  pleatStyle: string | null;
  distressing: string | null;
  waistbandStyle: string | null;
  silhouette: string | null;
  backDetail: string | null;
  strapStyle: string | null;
  lining: string | null;
  warmthLevel: string | null;
  waterResistance: string | null;
  hood: string | null;
  pockets: string | null;
  heelHeight: string | null;
  heelStyle: string | null;
  toeStyle: string | null;
  soleType: string | null;
  shaftHeight: string | null;
  accessoryType: string | null;
  bandWidth: string | null;
  sockHeight: string | null;
  necklaceLength: string | null;
  hatStyle: string | null;
  earringStyle: string | null;
  tieStyle: string | null;
  watchStyle: string | null;
  lensColor: string | null;
  legOpening: string | null;
  confidence: number;
  [key: string]: unknown;
}

const SYSTEM_PROMPT = `You are a professional fashion AI that analyzes clothing items from photographs. Your task is to identify every visible characteristic of the item and return a structured JSON description.

Rules:
- Return ONLY valid JSON. No markdown, no code fences, no extra text.
- Use null for any field you cannot determine from the image.
- For arrays, return empty array [] if nothing applies.
- Be specific and honest — if you're unsure, set confidence lower.
- Include fields only for the detected category — null irrelevant fields.

JSON schema to return:
{
  "name": "concise descriptive name (e.g. 'Black Oversized Graphic T-Shirt')",
  "category": "tops|bottoms|outerwear|dresses|shoes|accessories",
  "subcategory": "MUST be one of the following exact values based on the detected category — do NOT invent new ones:\n    tops: t-shirt | button-down | polo | sweater | hoodie | tank-top | blouse | turtleneck | cardigan | henley | sweatshirt | crop-top\n    bottoms: jeans | chinos | trousers | shorts | sweatpants | joggers | cargo-pants | leggings | skirt\n    outerwear: jacket | blazer | coat | vest | bomber | denim-jacket | trench-coat | puffer | parka\n    dresses: mini-dress | midi-dress | maxi-dress | sundress | shirt-dress | slip-dress\n    shoes: sneakers | boots | sandals | loafers | heels | flats\n    accessories: set to null — use accessoryType field instead",
  "primaryColor": "hex code like #1a1a1a",
  "secondaryColors": ["hex codes of other prominent colors"],
  "colorTemperature": "warm|cool|neutral",
  "colorIntensity": "muted|medium|vibrant",
  "pattern": "solid|striped|plaid|floral|graphic|camo|polka-dot|color-block|abstract|animal-print|paisley|checkered|tie-dye|houndstooth|geometric|null",
  "material": "cotton|denim|wool|leather|silk|linen|polyester|knit|suede|canvas|mesh|cashmere|velvet|corduroy|chiffon|satin|fleece|nylon|tweed|null",
  "texture": "smooth|ribbed|waffle|quilted|fuzzy|satin|mesh|crochet|distressed|embossed|boucle|terry|null",
  "transparency": "opaque|semi-sheer|sheer|null",
  "printType": "none|logo|text|graphic|all-over-print|placement-print|embroidered|null",
  "gender": "mens|womens|unisex|null",
  "formality": <integer 1-10, 1=sweatpants, 10=tuxedo>,
  "occasion": ["casual","business","formal","sport","party","date","lounge","beach","cocktail","outdoor"],
  "style": ["minimalist","streetwear","vintage","boho","preppy","grunge","athletic","classic","avant-garde","y2k","academia","western","military","punk"],
  "season": ["spring","summer","fall","winter"],
  "brand": "visible brand name or null",
  "tags": ["any notable details: distressing, raw hem, logo placement, unique cuts, etc."],
  "fit": "slim|regular|oversized|relaxed|tailored|skinny|wide|straight|flare|boxy|null",
  "sleeveLength": "sleeveless|cap-sleeve|short|three-quarter|long|null",
  "sleeveStyle": "set-in|raglan|puff|bishop|bell|cap|dolman|flutter|null",
  "neckline": "crew|v-neck|scoop|sweetheart|square|boat|off-shoulder|halter|cowl|asymmetrical|high-neck|null",
  "collarType": "none|point|spread|button-down|mandarin|band|polo|notched-lapel|peak-lapel|shawl|stand|null",
  "cuffStyle": "none|button|elastic|ribbed|roll-tab|french|null",
  "length": "cropped|regular|long|mini|above-knee|knee-length|midi|tea-length|maxi|ankle|floor-length|null",
  "hemStyle": "straight|curved|split|raw|ribbed|asymmetrical|null",
  "closureType": "pullover|buttons-front|buttons|zipper|lace-up|slip-on|buckle|strap|zip-fly|button-fly|pull-on|chelsea|monk-strap|null",
  "rise": "low|mid|high|ultra-high|null",
  "pleatStyle": "none|knife|box|accordion|inverted|front|null",
  "distressing": "none|light-wash|faded|ripped|frayed|raw-hem|destroyed|null",
  "waistbandStyle": "elastic|drawstring|belted|fixed|adjustable|paperbag|null",
  "silhouette": "a-line|bodycon|fit-and-flare|shift|empire|wrap|slip|tent|sheath|mermaid|null",
  "backDetail": "none|racerback|open-back|keyhole|cutout|cross-back|null",
  "strapStyle": "none|spaghetti|tank|halter|one-shoulder|thin-chain|chunky-chain|leather|fabric|crossbody|top-handle|shoulder|backpack|null",
  "lining": "none|partial|full|sherpa|quilted|faux-fur|satin|built-in-slip|fleece|null",
  "warmthLevel": "light|medium|heavy|insulated|null",
  "waterResistance": "none|water-resistant|waterproof|null",
  "hood": "none|fixed|detachable|stowable|null",
  "pockets": "none|side|patch|flap|welt|zip|internal|null",
  "heelHeight": "flat|low|mid|high|platform|null",
  "heelStyle": "none|block|stiletto|kitten|wedge|cone|null",
  "toeStyle": "round|pointed|square|almond|open|peep-toe|cap-toe|null",
  "soleType": "flat|platform|chunky|lug|thin|cleated|null",
  "shaftHeight": "none|low-top|ankle|mid-calf|knee-high|over-knee|null",
  "accessoryType": "watch|belt|necklace|bracelet|ring|earrings|scarf|hat|bag|socks|tie|sunglasses|gloves|brooch|cufflinks|hair-accessory|anklet|chain|choker|pocket-square|null",
  "bandWidth": "thin|medium|wide|null",
  "sockHeight": "no-show|ankle|quarter|crew|knee-high|thigh-high|null",
  "necklaceLength": "choker|princess|matinee|opera|lariat|rope|null",
  "hatStyle": "baseball|beanie|fedora|bucket|sun|beret|newsboy|cowboy|visor|null",
  "earringStyle": "stud|hoop|drop|chandelier|cuff|climber|null",
  "tieStyle": "necktie|bow-tie|skinny|knit|null",
  "watchStyle": "analog|digital|chronograph|dress|sport|smart|null",
  "lensColor": "black|brown|mirrored|gradient|clear|null",
  "legOpening": "straight|tapered|flared|cropped|slit|null",
  "confidence": <0.0 to 1.0 — your overall certainty in this analysis>
}`;

const MAX_RETRIES = 1;
const INITIAL_RETRY_DELAY = 1000; // ms

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fields that must be single strings, not arrays
const SINGLE_VALUE_FIELDS = new Set([
  'pattern', 'material', 'texture', 'transparency', 'printType', 'gender',
  'fit', 'sleeveLength', 'sleeveStyle', 'neckline', 'collarType', 'cuffStyle',
  'length', 'hemStyle', 'closureType', 'rise', 'pleatStyle', 'distressing',
  'waistbandStyle', 'silhouette', 'backDetail', 'strapStyle', 'lining',
  'warmthLevel', 'waterResistance', 'hood', 'pockets',
  'heelHeight', 'heelStyle', 'toeStyle', 'soleType', 'shaftHeight',
  'accessoryType', 'bandWidth', 'sockHeight', 'necklaceLength',
  'hatStyle', 'earringStyle', 'tieStyle', 'watchStyle', 'lensColor',
  'legOpening', 'colorTemperature', 'colorIntensity', 'subcategory',
  'primaryColor', 'brand', 'name',
]);

function sanitizeAnalysis(raw: Record<string, unknown>): ClothingAnalysis {
  for (const key of SINGLE_VALUE_FIELDS) {
    const val = raw[key];
    if (Array.isArray(val)) {
      raw[key] = val.length > 0 ? val[0] : null;
    }
  }
  return raw as unknown as ClothingAnalysis;
}

function parseAnalysisFromContent(content: string): ClothingAnalysis {
  // Extract JSON from response (may be wrapped in code fences)
  let jsonStr = content.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  // Try direct parse first
  try {
    const analysis = JSON.parse(jsonStr) as Record<string, unknown>;
    if (!analysis.category) {
      throw new Error('AI response missing required field: category');
    }
    return sanitizeAnalysis(analysis);
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('AI response missing')) {
      throw err;
    }
  }

  // Attempt to find JSON object in the text
  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (!objMatch) {
    throw new Error('Could not parse AI response as JSON');
  }
  const analysis = JSON.parse(objMatch[0]) as Record<string, unknown>;
  if (!analysis.category) {
    throw new Error('AI response missing required field: category');
  }
  return sanitizeAnalysis(analysis);
}

interface ProviderConfig {
  name: string;
  apiKey: string | undefined;
  baseUrl: string;
  model: string;
}

async function callProvider(imageUrl: string, config: ProviderConfig): Promise<ClothingAnalysis> {
  if (!config.apiKey) {
    throw new Error(`API key for ${config.name} not configured`);
  }

  console.log(`[aiAnalysis] Calling ${config.name} (${config.model})`);
  
  const response = await axios.post(
    `${config.baseUrl}/chat/completions`,
    {
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this clothing item from the photo and return the JSON description.' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`Empty response from ${config.name}`);
  }

  return parseAnalysisFromContent(content);
}

/**
 * Sends a clothing image to AI (OpenAI or Featherless) for analysis.
 * Implements fallback: OpenAI first, then Featherless.
 */
export async function analyzeClothing(imageUrl: string): Promise<ClothingAnalysis> {
  const providers: ProviderConfig[] = [
    {
      name: 'OpenAI',
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: process.env.OPENAI_MODEL || 'gpt-4o',
    },
    {
      name: 'Featherless',
      apiKey: process.env.FEATHERLESS_API_KEY,
      baseUrl: process.env.FEATHERLESS_BASE_URL || 'https://api.featherless.ai/v1',
      model: process.env.FEATHERLESS_MODEL || 'Qwen/Qwen3.6-27B',
    }
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    if (!provider.apiKey) continue;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await callProvider(imageUrl, provider);
      } catch (err: any) {
        lastError = err;
        
        // Don't retry/fallback on validation errors (the AI answered, but the format was wrong)
        if (err.message?.startsWith('AI response missing')) {
          throw err;
        }

        // Handle specific error codes
        const status = err.response?.status;
        if (status === 401) {
          console.error(`[aiAnalysis] ${provider.name} auth error: Invalid API key`);
          break; // Try next provider
        }

        if (attempt < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
          console.warn(`[aiAnalysis] ${provider.name} attempt ${attempt + 1} failed: ${err.message}. Retrying...`);
          await sleep(delay);
        } else {
          console.error(`[aiAnalysis] ${provider.name} failed after ${MAX_RETRIES + 1} attempts. Falling back if possible.`);
        }
      }
    }
  }

  throw lastError || new Error('No AI provider configured — set OPENAI_API_KEY or FEATHERLESS_API_KEY');
}
