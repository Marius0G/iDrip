import type { ClothingCategory } from "@/types/wardrobe";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: "select" | "multi-select" | "color" | "number" | "text";
  options?: FieldOption[];
}

export interface FieldGroup {
  group: string;
  fields: string[];
}

export const CATEGORY_FIELD_GROUPS: Record<ClothingCategory, FieldGroup[]> = {
  tops: [
    { group: "Basic Info", fields: ["subcategory", "primaryColor", "secondaryColors"] },
    { group: "Fit & Shape", fields: ["fit", "length", "sleeveLength", "sleeveStyle", "neckline", "hemStyle"] },
    { group: "Details", fields: ["collarType", "cuffStyle", "closureType", "backDetail", "lining"] },
    { group: "Style", fields: ["pattern", "material", "texture", "transparency", "printType"] },
    { group: "Occasion", fields: ["formality", "occasion", "style", "season", "gender", "colorTemperature", "colorIntensity"] },
  ],
  bottoms: [
    { group: "Basic Info", fields: ["subcategory", "primaryColor", "secondaryColors"] },
    { group: "Fit & Shape", fields: ["fit", "rise", "length", "legOpening"] },
    { group: "Details", fields: ["pleatStyle", "waistbandStyle", "closureType", "distressing", "lining"] },
    { group: "Style", fields: ["pattern", "material", "texture", "transparency", "printType"] },
    { group: "Occasion", fields: ["formality", "occasion", "style", "season", "gender", "colorTemperature", "colorIntensity"] },
  ],
  outerwear: [
    { group: "Basic Info", fields: ["subcategory", "primaryColor", "secondaryColors"] },
    { group: "Fit & Shape", fields: ["fit", "length", "sleeveLength"] },
    { group: "Details", fields: ["collarType", "closureType", "hood", "pockets", "lining", "warmthLevel", "waterResistance"] },
    { group: "Style", fields: ["pattern", "material", "texture", "transparency"] },
    { group: "Occasion", fields: ["formality", "occasion", "style", "season", "gender", "colorTemperature", "colorIntensity"] },
  ],
  dresses: [
    { group: "Basic Info", fields: ["subcategory", "primaryColor", "secondaryColors"] },
    { group: "Fit & Shape", fields: ["silhouette", "fit", "length", "sleeveLength", "sleeveStyle", "neckline", "strapStyle"] },
    { group: "Details", fields: ["closureType", "backDetail", "lining", "hemStyle"] },
    { group: "Style", fields: ["pattern", "material", "texture", "transparency", "printType"] },
    { group: "Occasion", fields: ["formality", "occasion", "style", "season", "gender", "colorTemperature", "colorIntensity"] },
  ],
  shoes: [
    { group: "Basic Info", fields: ["subcategory", "primaryColor", "secondaryColors"] },
    { group: "Details", fields: ["heelHeight", "heelStyle", "toeStyle", "closureType", "soleType", "shaftHeight", "lining", "waterResistance"] },
    { group: "Style", fields: ["pattern", "material", "texture"] },
    { group: "Occasion", fields: ["formality", "occasion", "style", "season", "gender", "colorTemperature", "colorIntensity"] },
  ],
  accessories: [
    { group: "Basic Info", fields: ["accessoryType", "primaryColor", "secondaryColors"] },
    { group: "Dimensions", fields: ["bandWidth", "sockHeight", "necklaceLength", "hatStyle", "strapStyle"] },
    { group: "Details", fields: ["earringStyle", "tieStyle", "watchStyle", "lensColor", "pattern", "material", "texture"] },
    { group: "Occasion", fields: ["formality", "occasion", "style", "season", "gender", "colorTemperature", "colorIntensity"] },
  ],
};

// Field enum values keyed by field name
export const FIELD_ENUMS: Record<string, FieldOption[]> = {
  category: [
    { value: "tops", label: "Tops" }, { value: "bottoms", label: "Bottoms" },
    { value: "outerwear", label: "Outerwear" }, { value: "dresses", label: "Dresses" },
    { value: "shoes", label: "Shoes" }, { value: "accessories", label: "Accessories" },
  ],
  subcategory: [
    { value: "t-shirt", label: "T-Shirt" }, { value: "button-down", label: "Button-Down" },
    { value: "polo", label: "Polo" }, { value: "sweater", label: "Sweater" },
    { value: "hoodie", label: "Hoodie" }, { value: "tank-top", label: "Tank Top" },
    { value: "blouse", label: "Blouse" }, { value: "turtleneck", label: "Turtleneck" },
    { value: "cardigan", label: "Cardigan" }, { value: "henley", label: "Henley" },
    { value: "sweatshirt", label: "Sweatshirt" }, { value: "crop-top", label: "Crop Top" },
    { value: "jeans", label: "Jeans" }, { value: "chinos", label: "Chinos" },
    { value: "trousers", label: "Trousers" }, { value: "shorts", label: "Shorts" },
    { value: "sweatpants", label: "Sweatpants" }, { value: "joggers", label: "Joggers" },
    { value: "cargo-pants", label: "Cargo Pants" }, { value: "leggings", label: "Leggings" },
    { value: "skirt", label: "Skirt" }, { value: "jacket", label: "Jacket" },
    { value: "blazer", label: "Blazer" }, { value: "coat", label: "Coat" },
    { value: "vest", label: "Vest" }, { value: "bomber", label: "Bomber" },
    { value: "denim-jacket", label: "Denim Jacket" }, { value: "trench-coat", label: "Trench Coat" },
    { value: "puffer", label: "Puffer" }, { value: "parka", label: "Parka" },
    { value: "mini-dress", label: "Mini Dress" }, { value: "midi-dress", label: "Midi Dress" },
    { value: "maxi-dress", label: "Maxi Dress" }, { value: "sundress", label: "Sundress" },
    { value: "shirt-dress", label: "Shirt Dress" }, { value: "slip-dress", label: "Slip Dress" },
    { value: "sneakers", label: "Sneakers" }, { value: "boots", label: "Boots" },
    { value: "sandals", label: "Sandals" }, { value: "loafers", label: "Loafers" },
    { value: "heels", label: "Heels" }, { value: "flats", label: "Flats" },
    { value: "watch", label: "Watch" }, { value: "belt", label: "Belt" },
    { value: "necklace", label: "Necklace" }, { value: "bracelet", label: "Bracelet" },
    { value: "ring", label: "Ring" }, { value: "earrings", label: "Earrings" },
    { value: "scarf", label: "Scarf" }, { value: "hat", label: "Hat" },
    { value: "bag", label: "Bag" }, { value: "socks", label: "Socks" },
    { value: "tie", label: "Tie" }, { value: "sunglasses", label: "Sunglasses" },
  ],
  pattern: [
    { value: "solid", label: "Solid" }, { value: "striped", label: "Striped" },
    { value: "plaid", label: "Plaid" }, { value: "floral", label: "Floral" },
    { value: "graphic", label: "Graphic" }, { value: "camo", label: "Camo" },
    { value: "polka-dot", label: "Polka Dot" }, { value: "color-block", label: "Color Block" },
    { value: "abstract", label: "Abstract" }, { value: "animal-print", label: "Animal Print" },
    { value: "paisley", label: "Paisley" }, { value: "checkered", label: "Checkered" },
    { value: "tie-dye", label: "Tie-Dye" }, { value: "houndstooth", label: "Houndstooth" },
    { value: "geometric", label: "Geometric" },
  ],
  material: [
    { value: "cotton", label: "Cotton" }, { value: "denim", label: "Denim" },
    { value: "wool", label: "Wool" }, { value: "leather", label: "Leather" },
    { value: "silk", label: "Silk" }, { value: "linen", label: "Linen" },
    { value: "polyester", label: "Polyester" }, { value: "knit", label: "Knit" },
    { value: "suede", label: "Suede" }, { value: "canvas", label: "Canvas" },
    { value: "mesh", label: "Mesh" }, { value: "cashmere", label: "Cashmere" },
    { value: "velvet", label: "Velvet" }, { value: "corduroy", label: "Corduroy" },
    { value: "chiffon", label: "Chiffon" }, { value: "satin", label: "Satin" },
    { value: "fleece", label: "Fleece" }, { value: "nylon", label: "Nylon" },
  ],
  texture: [
    { value: "smooth", label: "Smooth" }, { value: "ribbed", label: "Ribbed" },
    { value: "waffle", label: "Waffle" }, { value: "quilted", label: "Quilted" },
    { value: "fuzzy", label: "Fuzzy" }, { value: "satin", label: "Satin" },
    { value: "mesh", label: "Mesh" }, { value: "crochet", label: "Crochet" },
    { value: "distressed", label: "Distressed" }, { value: "embossed", label: "Embossed" },
  ],
  fit: [
    { value: "slim", label: "Slim" }, { value: "regular", label: "Regular" },
    { value: "oversized", label: "Oversized" }, { value: "relaxed", label: "Relaxed" },
    { value: "tailored", label: "Tailored" }, { value: "skinny", label: "Skinny" },
    { value: "wide", label: "Wide" }, { value: "straight", label: "Straight" },
    { value: "flare", label: "Flare" }, { value: "boxy", label: "Boxy" },
  ],
  sleeveLength: [
    { value: "sleeveless", label: "Sleeveless" }, { value: "cap-sleeve", label: "Cap Sleeve" },
    { value: "short", label: "Short" }, { value: "three-quarter", label: "Three Quarter" },
    { value: "long", label: "Long" },
  ],
  neckline: [
    { value: "crew", label: "Crew" }, { value: "v-neck", label: "V-Neck" },
    { value: "scoop", label: "Scoop" }, { value: "sweetheart", label: "Sweetheart" },
    { value: "square", label: "Square" }, { value: "boat", label: "Boat" },
    { value: "off-shoulder", label: "Off Shoulder" }, { value: "halter", label: "Halter" },
    { value: "cowl", label: "Cowl" }, { value: "asymmetrical", label: "Asymmetrical" },
    { value: "high-neck", label: "High Neck" },
  ],
  rise: [
    { value: "low", label: "Low" }, { value: "mid", label: "Mid" },
    { value: "high", label: "High" }, { value: "ultra-high", label: "Ultra High" },
  ],
  length: [
    { value: "cropped", label: "Cropped" }, { value: "regular", label: "Regular" },
    { value: "long", label: "Long" }, { value: "mini", label: "Mini" },
    { value: "above-knee", label: "Above Knee" }, { value: "knee-length", label: "Knee Length" },
    { value: "midi", label: "Midi" }, { value: "maxi", label: "Maxi" },
    { value: "ankle", label: "Ankle" },
  ],
  silhouette: [
    { value: "a-line", label: "A-Line" }, { value: "bodycon", label: "Bodycon" },
    { value: "fit-and-flare", label: "Fit & Flare" }, { value: "shift", label: "Shift" },
    { value: "empire", label: "Empire" }, { value: "wrap", label: "Wrap" },
    { value: "slip", label: "Slip" }, { value: "sheath", label: "Sheath" },
  ],
  heelHeight: [
    { value: "flat", label: "Flat" }, { value: "low", label: "Low" },
    { value: "mid", label: "Mid" }, { value: "high", label: "High" },
    { value: "platform", label: "Platform" },
  ],
  accessoryType: [
    { value: "watch", label: "Watch" }, { value: "belt", label: "Belt" },
    { value: "necklace", label: "Necklace" }, { value: "bracelet", label: "Bracelet" },
    { value: "ring", label: "Ring" }, { value: "earrings", label: "Earrings" },
    { value: "scarf", label: "Scarf" }, { value: "hat", label: "Hat" },
    { value: "bag", label: "Bag" }, { value: "socks", label: "Socks" },
    { value: "tie", label: "Tie" }, { value: "sunglasses", label: "Sunglasses" },
    { value: "gloves", label: "Gloves" }, { value: "brooch", label: "Brooch" },
    { value: "cufflinks", label: "Cufflinks" }, { value: "hair-accessory", label: "Hair Accessory" },
    { value: "anklet", label: "Anklet" }, { value: "chain", label: "Chain" },
    { value: "choker", label: "Choker" }, { value: "pocket-square", label: "Pocket Square" },
  ],
  gender: [
    { value: "mens", label: "Men's" }, { value: "womens", label: "Women's" },
    { value: "unisex", label: "Unisex" },
  ],
  occasion: [
    { value: "casual", label: "Casual" }, { value: "business", label: "Business" },
    { value: "formal", label: "Formal" }, { value: "sport", label: "Sport" },
    { value: "party", label: "Party" }, { value: "date", label: "Date" },
    { value: "lounge", label: "Lounge" }, { value: "beach", label: "Beach" },
    { value: "cocktail", label: "Cocktail" }, { value: "outdoor", label: "Outdoor" },
    { value: "travel", label: "Travel" },
  ],
  style: [
    { value: "minimalist", label: "Minimalist" }, { value: "streetwear", label: "Streetwear" },
    { value: "vintage", label: "Vintage" }, { value: "boho", label: "Boho" },
    { value: "preppy", label: "Preppy" }, { value: "grunge", label: "Grunge" },
    { value: "athletic", label: "Athletic" }, { value: "classic", label: "Classic" },
    { value: "avant-garde", label: "Avant-Garde" }, { value: "y2k", label: "Y2K" },
    { value: "academia", label: "Academia" }, { value: "western", label: "Western" },
    { value: "military", label: "Military" }, { value: "punk", label: "Punk" },
    { value: "goth", label: "Goth" }, { value: "cottagecore", label: "Cottagecore" },
    { value: "normcore", label: "Normcore" }, { value: "skater", label: "Skater" },
    { value: "nautical", label: "Nautical" },
  ],
  season: [
    { value: "spring", label: "Spring" }, { value: "summer", label: "Summer" },
    { value: "fall", label: "Fall" }, { value: "winter", label: "Winter" },
  ],
  colorTemperature: [
    { value: "warm", label: "Warm" }, { value: "cool", label: "Cool" },
    { value: "neutral", label: "Neutral" },
  ],
  colorIntensity: [
    { value: "muted", label: "Muted" }, { value: "medium", label: "Medium" },
    { value: "vibrant", label: "Vibrant" },
  ],
  transparency: [
    { value: "opaque", label: "Opaque" }, { value: "semi-sheer", label: "Semi-Sheer" },
    { value: "sheer", label: "Sheer" },
  ],
  printType: [
    { value: "none", label: "None" }, { value: "logo", label: "Logo" },
    { value: "text", label: "Text" }, { value: "graphic", label: "Graphic" },
    { value: "all-over-print", label: "All-Over Print" }, { value: "placement-print", label: "Placement Print" },
    { value: "embroidered", label: "Embroidered" },
  ],
};

// Fields that contain free-form text (not select from enum)
export const TEXT_FIELDS = new Set(["name", "brand"]);

// Fields that are multi-select arrays
export const MULTI_SELECT_FIELDS = new Set([
  "secondaryColors", "occasion", "style", "season", "tags",
]);
