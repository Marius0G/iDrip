export const STYLE_OPTIONS = [
  { value: "casual", label: "Casual", emoji: "" },
  { value: "formal", label: "Formal", emoji: "" },
  { value: "streetwear", label: "Streetwear", emoji: "" },
  { value: "minimalist", label: "Minimalist", emoji: "" },
  { value: "bohemian", label: "Bohemian", emoji: "" },
  { value: "sporty", label: "Sporty", emoji: "" },
  { value: "vintage", label: "Vintage", emoji: "" },
  { value: "preppy", label: "Preppy", emoji: "" },
] as const;

export const OCCASION_OPTIONS = [
  { value: "casual", label: "Casual" },
  { value: "business", label: "Business" },
  { value: "formal", label: "Formal" },
  { value: "date", label: "Date Night" },
  { value: "sport", label: "Sport" },
  { value: "party", label: "Party" },
  { value: "travel", label: "Travel" },
  { value: "beach", label: "Beach" },
  { value: "outdoor", label: "Outdoor" },
] as const;

export const WEATHER_OPTIONS = [
  { value: "sunny", label: "Sunny" },
  { value: "hot", label: "Hot" },
  { value: "cold", label: "Cold" },
  { value: "rainy", label: "Rainy" },
  { value: "snowy", label: "Snowy" },
  { value: "windy", label: "Windy" },
  { value: "humid", label: "Humid" },
  { value: "cloudy", label: "Cloudy" },
  { value: "mild", label: "Mild" },
] as const;

export const FEEDBACK_OPTIONS = [
  { value: "too_formal", label: "Too formal" },
  { value: "too_casual", label: "Too casual" },
  { value: "colors_clash", label: "Colors don't match" },
  { value: "not_weather_appropriate", label: "Not weather-appropriate" },
  { value: "dont_like_items", label: "Don't like these items" },
] as const;
