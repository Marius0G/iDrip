import type { BudgetSettings, StylePreference } from "./shopping";

export interface User {
  id: string;
  googleId?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  stylePreferences: StylePreference[];
  budget: BudgetSettings;
  createdAt: string;
}

export interface UserSettings {
  stylePreferences: StylePreference[];
  budget: BudgetSettings;
}
