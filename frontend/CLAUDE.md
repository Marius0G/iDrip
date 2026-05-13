# Frontend Module

<!-- AUTO-MANAGED: module-description -->
## Module Description

React SPA for iDrip. Handles wardrobe management, outfit generation UI, shopping recommendations, and user profile. Entry point: `src/main.tsx`.
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
src/
  main.tsx          # Vite entry point
  index.css         # Tailwind v4 (`@import "tailwindcss"`) + `@theme inline` token mapping + CSS HSL vars + `@utility` glass classes
  app/
    AppProviders.tsx       # Wraps app in RouterProvider
    router.tsx             # createBrowserRouter — routes: / wardrobe generator shopping profile *
    layouts/
      RootLayout.tsx       # Sidebar + Header + <main md:ml-64> + MobileNav + Outlet
  components/
    glass/
      GlassCard.tsx        # CVA component: size (sm/default/lg) + hover variants
      GlassPanel.tsx       # Simple backdrop-blur-2xl glass wrapper
    layout/
      Sidebar.tsx          # Desktop nav (hidden md:flex, w-64, fixed left); 4 nav items + Profile at bottom; routes from ROUTES in @/lib/constants
      Header.tsx           # Mobile-only (md:hidden), sticky top; iDrip logo + avatar placeholder; inline glass style
      MobileNav.tsx        # Mobile-only (flex md:hidden), fixed bottom; 5 nav items: Home, Wardrobe, AI, Shop, Profile; inline glass style
      PageContainer.tsx    # Page content wrapper
    dashboard/
      StatCard.tsx              # Glass stat tile: icon + label + value + optional subtitle + optional className
      RecentOutfitCarousel.tsx  # Horizontal scrollable carousel of up to 5 outfits; null when empty
      QuickActions.tsx          # 3 action buttons: Upload Clothing, Generate Outfit, Browse Recs
    wardrobe/
      ClothingCard.tsx          # Button card: aspect-[3/4] image, name/category/brand, up to 2 tag pills
      ClothingGrid.tsx          # Responsive grid (2/3/4 cols); renders ClothingCard per item
      ClothingUploadDialog.tsx  # Modal overlay: image upload, name, category, color, season pills, brand, tags
      ClothingDetailSheet.tsx   # Overlay panel: item details + delete; slide-up mobile / right panel md+
      CategoryFilter.tsx        # Horizontal scrollable pill filter for ClothingCategory | "all"
    outfit/
      OutfitSlot.tsx            # Single slot button: aspect-[3/4]; dashed empty / filled with gradient overlay; animate-pulse when isGenerating
      OutfitBuilder.tsx         # Grid of 5 OutfitSlots (top/bottom/shoes/outerwear/accessory1); 3 cols mobile / 5 cols md
      GenerateButton.tsx        # Full-width button; idle: Wand2 icon; generating: Loader2 animate-spin
      OutfitCard.tsx            # Glass card: up to 4 overlapping item images, occasion, score, aiReasoning (line-clamp-2)
      OutfitGrid.tsx            # Responsive grid (1/2/3 cols); renders OutfitCard per outfit
  pages/
    DashboardPage.tsx        # 4 StatCards + RecentOutfitCarousel + QuickActions; EmptyState when wardrobe empty
    WardrobePage.tsx         # SearchInput + CategoryFilter + ClothingGrid; ClothingUploadDialog + ClothingDetailSheet overlays
    OutfitGeneratorPage.tsx  # Builder tab (occasion/season selectors, OutfitBuilder, AI reasoning, GenerateButton) + Saved tab (OutfitGrid)
    ShoppingPage.tsx         # Shopping recommendations
    ProfilePage.tsx          # User profile and settings
    NotFoundPage.tsx         # 404 fallback
  stores/                  # Zustand stores: useWardrobeStore, useOutfitStore, useShoppingStore, useUserStore
  services/                # API clients: wardrobeService, outfitService, shoppingService
  hooks/                   # useTheme, useMediaQuery, useDebounce, useImageUpload
  data/
    categories.ts          # CLOTHING_CATEGORIES, CLOTHING_COLORS, SEASONS
    styles.ts              # OCCASION_OPTIONS, style preference lookups
  types/
    wardrobe.ts     # ClothingItem, ClothingCategory, ClothingColor, Season, WardrobeFilters, WardrobeStats
    outfit.ts       # Outfit, OutfitItem, OutfitOccasion, OutfitSlotKey, OutfitGenerationRequest
    shopping.ts     # ShoppingRecommendation, BudgetSettings, StylePreference
    user.ts         # User, UserSettings
    common.ts       # ApiResponse<T>
  lib/
    constants.ts    # ROUTES constant — path strings for all routes
    utils.ts        # cn() and other utility helpers
  assets/           # Static assets
```
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Conventions

- Import alias `@/` resolves to `src/` — configured in both `vite.config.ts` and `tsconfig.app.json`
- All domain types imported from `src/types/` with `import type` syntax (`verbatimModuleSyntax`)
- TypeScript target ES2022, strict mode enabled
- No unused locals or parameters — enforced by compiler
- No `App.tsx` or `App.css` — `main.tsx` renders `<AppProviders />` directly; all styles via Tailwind
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: patterns -->
## Component Patterns

- **Glass card style**: `bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)]` — used on all cards. Hover: `hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)] hover:scale-[1.02]`. Touch: `active:scale-[0.98] touch-press`.
- **Glass nav style**: `bg-[hsl(var(--frost)/0.85)] backdrop-blur-xl` with glacier accent line — MobileNav and Header use this pattern
- **Active pill style**: `bg-[hsl(var(--glacier))] text-white` — glacier blue fill. Used in CategoryFilter, season selectors, nav items
- **Inactive pill style**: `bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)]`
- **Overlay pattern**: `fixed inset-0 z-50` with animated backdrop + slide-up panel using `useAnimatedMount` and `useScrollLock` hooks
  - Dialog: slides from bottom on mobile (`items-end`), centered on md+ (`md:items-center`); max-w-lg, rounded-t-3xl md:rounded-3xl
  - Detail sheet: slides from bottom on mobile with swipe-to-dismiss gesture (drag handle pill on header), right panel on md+ (`md:w-96 md:h-full`); rounded-t-3xl md:rounded-none
- **Outfit generation requirement**: wardrobe must contain at least 1 top + 1 bottom + 1 shoes; GenerateButton disabled otherwise
- **OutfitSlot `isGenerating`**: passes `animate-pulse` class to slot when AI generation is in progress
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: backlog-status -->
## Backlog Status

**Implemented (Done):** Wardrobe browse/filter/upload/delete/detail, AI outfit generation + slots + save, shopping recommendations + budget + style filter, dashboard stats + carousel + quick actions, responsive nav, theme toggle, profile/preferences, clear data.

**Pending (To Do):**
- US-1.6 Edit Clothing Item — edit button in detail sheet opens pre-filled form, all fields editable (Medium, 3pts)
- US-2.4 Manually Build Outfit — clicking slot opens category picker, swap items, mix with AI picks (Medium, 5pts)
- US-2.5 Rate Outfit — star rating on outfit cards, persisted in store (Low, 2pts)
- US-3.4 Purchase Tracking — "Bought it" button creates wardrobe item, deducts from budget (Medium, 5pts)

**Future Epics (not started):**
- Epic 7: Authentication — registration + login UI (High priority)
- Epic 8: AI Integration:
  - US-8.1 Real AI outfit gen (13pts) — replace random picker with actual LLM
  - US-8.2 AI clothing recognition agent (13pts) — vision LLM analyzes uploaded photo, returns structured JSON (name/category/subcategory/color/brand/tags/season/confidence); confidence < 0.5 falls back to manual entry; frontend pre-fills upload form with editable AI suggestions
  - US-8.2.1 Backend analyze-clothing endpoint (5pts) — `POST /api/ai/analyze-clothing`, proxies to Python ai-service, 10s timeout, 503 fallback, rate-limited 10 req/min
  - US-8.2.2 Python ai-service (13pts) — LangGraph agent: Image Preprocessor → Vision Analyzer → Output Parser → Confidence Scorer; Dockerized; env vars: LLM_MODEL, LLM_API_KEY, LLM_BASE_URL
  - US-8.3 Real shopping recommendations (13pts) — live product data from online stores
<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: dependencies -->
## Key Dependencies

- **React** — UI framework
- **React Router DOM** — client-side routing
- **Zustand** — global state management
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin) — styling with animation support
- **tailwind-merge** + `clsx` + `class-variance-authority` — variant-safe className composition
- **lucide-react** — icon set
- **Vite** + `@vitejs/plugin-react` — build tooling

### Theme System — Peak Drip (Alpine Frost)
- Tailwind v4: `@import "tailwindcss"` in `index.css`; `@theme inline` maps CSS vars to Tailwind tokens
- Dark mode: `@custom-variant dark (&:is(.dark *))` — toggled via `.dark` class on root element
- Full design system reference: `DESIGN_SYSTEM.md` at project root (authoritative for all visual decisions)
- Color tokens (HSL vars): `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--muted-foreground`, `--accent`, `--destructive`, `--border`, `--input`, `--ring` plus Alpine-specific: `--frost`, `--glacier`, `--peak`, `--punctuation`
- Border radius token: `--radius` (default `0.5rem` — sharper for editorial feel); derived tokens via `calc()`
- Font tokens: `--font-display: 'Citadel Script', 'Playfair Display', Georgia, serif` (hero headlines only, NOT logo); `--font-sans: 'Helvetica Now Display', 'DM Sans', 'Inter', system-ui` (logo, UI, body)
- Glass pattern: `bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)]` — all components use semantic tokens, not the old `bg-white/70 dark:bg-white/[0.06]` pattern
- Active states: `bg-[hsl(var(--glacier))] text-white` — glacier blue
- Danger/delete: `border-[hsl(var(--punctuation)/0.3)] text-[hsl(var(--punctuation))] hover:bg-[hsl(var(--punctuation)/0.06)]` — red punctuation token
- Red punctuation: `<RedPunct>.</RedPunct>` component or `.text-[hsl(var(--punctuation))]` — for brand moments, never for errors
- Touch: `active:scale-[0.98] touch-press` on all interactive cards for mobile press feedback
- Safe area: `safe-area-bottom` / `safe-area-top` utilities using `env(safe-area-inset-*)`

### Type Reference
- `ClothingCategory`: tops | bottoms | outerwear | dresses | shoes | accessories
- `Season`: spring | summer | fall | winter | all
- `OutfitOccasion`: casual | work | formal | date | sport | travel
- `StylePreference`: casual | formal | streetwear | minimalist | bohemian | sporty | vintage | preppy
<!-- END AUTO-MANAGED -->
