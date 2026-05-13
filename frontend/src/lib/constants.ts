export const ROUTES = {
  HOME: "/",
  WARDROBE: "/wardrobe",
  GENERATOR: "/generator",
  SHOPPING: "/shopping",
  PROFILE: "/profile",
  SUBSCRIPTION: "/subscription",
  LOGIN: "/login",
} as const;

export const NAV_ITEMS = [
  { path: ROUTES.HOME, label: "Home", icon: "LayoutDashboard" },
  { path: ROUTES.WARDROBE, label: "Wardrobe", icon: "Shirt" },
  { path: ROUTES.GENERATOR, label: "Generator", icon: "Wand2" },
  { path: ROUTES.SHOPPING, label: "Shopping", icon: "ShoppingBag" },
  { path: ROUTES.PROFILE, label: "Profile", icon: "User" },
] as const;

export const CLOTHING_CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "outerwear", label: "Outerwear" },
  { value: "dresses", label: "Dresses" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
];

export const STYLE_OPTIONS: { value: string; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "streetwear", label: "Streetwear" },
  { value: "minimalist", label: "Minimalist" },
  { value: "bohemian", label: "Bohemian" },
  { value: "sporty", label: "Sporty" },
  { value: "vintage", label: "Vintage" },
  { value: "preppy", label: "Preppy" },
];
