import type { User } from "@/types/user";

export const mockUser: User = {
  id: "user-1",
  name: "Alex Demo",
  email: "alex@idrip.demo",
  stylePreferences: ["streetwear", "minimalist", "casual"],
  budget: {
    monthlyBudget: 150,
    spent: 45,
    currency: "USD",
  },
  theme: "light",
  createdAt: "2024-01-01T00:00:00Z",
};
