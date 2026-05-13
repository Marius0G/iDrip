# Peak Drip — iDrip Design System

The single source of truth for all visual decisions in the iDrip app. Every color, font, animation, spacing rule, and component convention is documented here. When making UI changes, reference this document — not memory or assumptions.

---

## 1. Concept & Tone

**"Peak Drip"** — cold mountain luxury meets hypebeast editorial.

| Dimension | Direction |
|---|---|
| **Vibe** | Aspen boutique × Supreme lookbook × snowboard magazine spread |
| **Lighting** | Crisp morning snow under high-altitude sun |
| **Dark mode** | Deep mountain night, moon on fresh powder |
| **Editorial voice** | Bold, angular, confident. Fashion-forward, not precious. |
| **One thing to remember** | Red periods. Everything has a red punctuation mark. |

**Guiding principle:** Type like a magazine, move like a snowboarder, dress like you're at fashion week.

---

## 2. Typography

### Font Stack

| Role | Primary | Fallback 1 | Fallback 2 | Fallback 3 |
|---|---|---|---|---|
| **Display** | Citadel Script | Playfair Display | Georgia | serif |
| **Body** | Helvetica Now Display | DM Sans | Inter | system-ui |
| **Mono** | JetBrains Mono | Fira Code | monospace | — |

### Font Files (self-hosted)

```
/public/fonts/
  CitadelScript-Regular.woff2    ← display, weight 400
  HelveticaNowDisplay-Light.woff2    ← body, weight 300
  HelveticaNowDisplay-Regular.woff2  ← body, weight 400
  HelveticaNowDisplay-Bold.woff2     ← body, weight 700
  HelveticaNowDisplay-Medium.otf     ← body, weight 500 (fallback only)
  HelveticaNowDisplay-Black.otf      ← body, weight 900 (fallback only)
  + italic variants (.otf)
```

### Usage Rules

| Context | Element | Font | Weight | Size | Tracking |
|---|---|---|---|---|---|
| App logo / wordmark | `h1` with `font-bold` | Helvetica Now Display | 700 | 1.5rem–3rem | tight |
| Hero headlines | `font-display` class | Citadel Script | 400 | 2.5rem+ | wide |
| Page headings | `h2` with `font-bold` | Helvetica Now Display | 700 | 1.5rem | -0.02em |
| Section headings | `h3` with `font-semibold` | Helvetica Now Display | 600 | 1.125rem | -0.02em |
| Overline / label | `text-overline` utility | Helvetica Now Display | 600 | 0.6875rem | 0.12em (all caps) |
| Body copy | default | Helvetica Now Display | 400 | 0.875rem | -0.01em |
| Nav items | `text-sm font-medium` | Helvetica Now Display | 500 | 0.875rem | normal |
| Data / numbers | `font-mono` | JetBrains Mono | 400 | inherit | normal |

**Font rule:** Citadel Script is cursive — use it for **hero headlines** and **statement text** only. Never use it for the "iDrip" logo wordmark. The logo uses Helvetica Now Display with red punctuation. `font-display` is for editorial moments, not branding.

### Red Punctuation Rule

**Never use a plain colon, period, or exclamation mark in a display context.** Replace with the `RedPunct` component or `.punctuation` class:

```tsx
// Component approach (preferred)
<h1>iDrip<RedPunct>.</RedPunct></h1>

// CSS class approach
<span class="punctuation">:</span>

// Direct HSL
<span className="text-[hsl(var(--punctuation))]">.</span>
```

**Where red punctuation belongs:**
- After the logo wordmark ("iDrip.")
- After section overline labels ("NEW DROP.")
- Colons in forms ("Email:")
- Active state period in nav items
- Lookbook-style captions

**Where it does NOT belong:**
- Error messages (use red as a full color there)
- Body text punctuation
- Non-brand contexts
- Numbers/statistics

---

## 3. Color System

### Semantic Token Architecture

Every color is referenced through a semantic CSS variable that maps to an HSL triple. **Never hardcode colors** — always reference a token.

```
Pattern: hsl(var(--token-name))
Example: bg-[hsl(var(--frost)/0.7)]
```

### Light Theme ("Alpine Day")

```
┌─────────────────────┬─────────────────┬──────────────────────────────────┐
│ Token               │ HSL             │ Visual                           │
├─────────────────────┼─────────────────┼──────────────────────────────────┤
│ --background        │ 210 30% 97%     │ Fresh snow white                 │
│ --foreground        │ 220 25% 10%     │ Deep navy text                   │
│ --card              │ 210 20% 99%     │ Frost white surface              │
│ --primary           │ 210 90% 35%     │ Glacier blue (CTAs)              │
│ --secondary         │ 210 25% 93%     │ Cool gray-blue background        │
│ --muted             │ 210 20% 90%     │ Light gray surface               │
│ --muted-foreground  │ 215 15% 42%     │ Medium gray text                 │
│ --accent            │ 355 85% 48%     │ Red accent                       │
│ --destructive       │ 0 72% 48%       │ Destructive red                  │
│ --border            │ 210 15% 84%     │ Cool gray border                 │
│ --input             │ 210 15% 86%     │ Input field border               │
│ --ring              │ 210 90% 40%     │ Focus ring                       │
├─────────────────────┼─────────────────┼──────────────────────────────────┤
│ --frost             │ 210 30% 96%     │ Glass surface base               │
│ --glacier           │ 210 80% 42%     │ Active states, CTAs, highlights  │
│ --peak              │ 220 20% 18%     │ Strong text, icons               │
│ --punctuation       │ 355 85% 50%     │ Red punctuation marks            │
└─────────────────────┴─────────────────┴──────────────────────────────────┘
```

### Dark Theme ("Alpine Night")

```
┌─────────────────────┬─────────────────┬──────────────────────────────────┐
│ Token               │ HSL             │ Visual                           │
├─────────────────────┼─────────────────┼──────────────────────────────────┤
│ --background        │ 222 25% 4%      │ Deep mountain night              │
│ --foreground        │ 210 15% 92%     │ Moonlit text                     │
│ --card              │ 222 20% 8%      │ Dark frost surface               │
│ --primary           │ 210 80% 52%     │ Brighter glacier blue            │
│ --secondary         │ 220 16% 16%     │ Dark cool surface                │
│ --muted             │ 220 14% 20%     │ Dark muted surface               │
│ --muted-foreground  │ 215 8% 75%      │ Light secondary text             │
│ --border            │ 220 12% 22%     │ Visible cool border              │
│ --ring              │ 210 80% 55%     │ Focus ring                       │
├─────────────────────┼─────────────────┼──────────────────────────────────┤
│ --frost             │ 220 16% 14%     │ Glass surface base (dark)        │
│ --glacier           │ 210 80% 48%     │ Active states (dark)             │
│ --peak              │ 210 12% 90%     │ Light text for dark              │
│ --punctuation       │ 355 82% 56%     │ Brighter red punctuation         │
└─────────────────────┴─────────────────┴──────────────────────────────────┘
```

### Token Usage Map

```
Element              │ Light Token              │ Dark Token
─────────────────────┼──────────────────────────┼──────────────────────────
Page background      │ bg-snowdrift (utility)   │ same (adapts via theme)
Card surface         │ bg-[hsl(var(--frost)/0.7)]│ same
Active nav / CTA     │ bg-[hsl(var(--glacier))]  │ same
Strong text          │ text-[hsl(var(--peak))]   │ same
Subtle background    │ bg-[hsl(var(--frost))]    │ same
Border               │ border-[hsl(var(--border)/0.4)]│ same
Red accent           │ text-[hsl(var(--punctuation))] │ same
Hover state          │ hover:bg-[hsl(var(--frost))]   │ same
```

**Critical rule:** The semantic tokens (`--frost`, `--glacier`, `--peak`, `--punctuation`) change value between light and dark themes. When using them, you don't need `dark:` variants — the token itself handles the theme switch.

---

## 4. Spacing & Geometry

### Border Radius Scale

```
Base: 0.5rem (8px) — sharper than typical for editorial feel

--radius-sm:  0.25rem (4px)  →  buttons, inputs, small pills
--radius-md:  0.375rem (6px) →  compact cards
--radius-lg:  0.5rem (8px)   →  default cards
--radius-xl:  0.75rem (12px) →  larger panels
--radius-2xl: 1rem (16px)    →  GlassCard default
--radius-3xl: 1.5rem (24px)  →  GlassCard lg, modals
```

### Component Shape Guide

| Component | Radius | Rationale |
|---|---|---|
| GlassCard | `rounded-2xl` | Default card surface |
| GlassPanel | `rounded-3xl` | Larger, more dramatic |
| Modal/Dialog | `rounded-t-3xl md:rounded-3xl` | Mobile sheet, desktop modal |
| Buttons (CTA) | `rounded-2xl` | Generous, clickable |
| Buttons (inline) | `rounded-xl` | Compact |
| Inputs/Selects | `rounded-xl` | Consistent with buttons |
| Pills/Tags | `rounded-full` | Only element that stays fully round |
| Nav items | `rounded-xl` | Slightly softer than inputs |
| Avatars | `rounded-2xl` | Squircle, not circle |
| Icon containers | `rounded-xl` | Matches button radius |

### Angular Geometry

The system has clip-path utilities for diagonal "peak" cuts — use sparingly for hero sections and dividers:

```
clip-peak-up     →  polygon(0% 8%, 100% 0%, 100% 92%, 0% 100%)
clip-peak-down   →  polygon(0% 0%, 100% 8%, 100% 100%, 0% 92%)
clip-chevron-up  →  chevron pointing up
clip-ridgeline   →  mountain-like bottom edge
```

---

## 5. Glassmorphism (Frost)

All elevated surfaces use frost glass — translucent backgrounds with backdrop blur.

### Standard Frost Card

```
bg-[hsl(var(--frost)/0.7)]
backdrop-blur-xl
border border-[hsl(var(--border)/0.4)]
shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)]
rounded-2xl
transition-all duration-300
```

### Hover Elevation

```
hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)]
hover:scale-[1.02]
```

### Navigation Glass

```
bg-[hsl(var(--frost)/0.8)]
backdrop-blur-xl
border border-[hsl(var(--border)/0.4)]
```

### Available @utility Shortcuts

```
glass          → base glass surface (frost/0.65)
glass-card     → card with shadow + radius-2xl
glass-card-lg  → large card with glacier shadow + radius-3xl
glass-nav      → nav bar glass (frost/0.8)
```

**Usage note:** The utility classes work but components currently use inline classes for flexibility. Both approaches are valid. Prefer inline when you need dark mode or hover variants.

---

## 6. Component Token Patterns

Every component follows one of these patterns. **Copy-paste from here, don't invent.**

### Active State (glacier blue)

```
"bg-[hsl(var(--glacier))] text-white"
```

### Inactive Surface (frost)

```
"bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)]"
```

### Card Surface (frost glass)

```
"bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)] rounded-2xl"
```

### Input Field

```
"bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"
```

### Delete / Danger

```
"border border-[hsl(var(--punctuation)/0.3)] text-[hsl(var(--punctuation))] hover:bg-[hsl(var(--punctuation)/0.06)]"
```

### Error Banner

```
"bg-[hsl(var(--punctuation)/0.08)] border border-[hsl(var(--punctuation)/0.3)] text-[hsl(var(--punctuation))]"
```

### Subtle Background (non-interactive)

```
"bg-[hsl(var(--frost))]"
```

### Progress / Bar Fill

```
"bg-[hsl(var(--glacier))]"
```

### Progress / Bar Track

```
"bg-[hsl(var(--frost))]"
```

---

## 7. Motion

### Animation Tokens

| Token | Duration | Easing | Use |
|---|---|---|---|
| `animate-frost-reveal` | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | Cards appearing on page load |
| `animate-peak-in` | 0.6s | cubic-bezier(0.16, 1, 0.3, 1) | Section entrance (clip-path) |
| `animate-drift` | 20s | linear infinite | Background gradient drift |

### Staggered Reveal

For lists and grids, use sequential stagger utilities. Each child gets one:

```
stagger-1  →  0.05s delay
stagger-2  →  0.10s delay
stagger-3  →  0.15s delay
stagger-4  →  0.20s delay
stagger-5  →  0.25s delay
stagger-6  →  0.30s delay
```

**Rule:** The `cubic-bezier(0.16, 1, 0.3, 1)` easing is the system standard. It's sharp and confident — no mushy ease-in-out. Use it everywhere.

### Transitions

```
Default hover:   transition-all duration-300
Fast toggle:     transition-all duration-200
Color only:      transition-colors
Opacities:       transition-opacity
```

---

## 8. Background & Atmosphere

### Page Background

Use `bg-snowdrift` on the root layout:
- Two radial gradients at opposite corners creating depth
- Adapts to dark mode via CSS variables
- No hard edges — gradients bleed into the background color

### Grain Texture

Use `bg-frost-noise` on any surface that needs atmosphere:
- SVG feTurbulence at 3% opacity (light) / 4% (dark)
- Multiply blend mode (light) / Screen (dark)
- `pointer-events: none` — never interferes with clicks
- 128px tile — imperceptible pattern

### Glacier Gradient

Use `bg-glacier` for accent strips, decorative elements:
- `linear-gradient(135deg, hsl(210 90% 40%), hsl(200 85% 50%), hsl(210 80% 35%))`
- Only on non-interactive decorative elements
- Do not use as button/text background (poor contrast)

---

## 9. Layout Conventions

### Page Structure

```
RootLayout
  bg-snowdrift (full viewport)
  ├── Sidebar (desktop: fixed left, w-64)
  ├── Header (mobile: sticky top)
  ├── <main> with md:ml-64 (desktop offset)
  │   └── PageContainer (max-w-7xl, px-4 md:px-6, py-6)
  │       └── Page content
  └── MobileNav (mobile: fixed bottom)
```

### Responsive Breakpoints

| Breakpoint | Target | Behavior |
|---|---|---|
| Default (mobile) | < 768px | Bottom nav, sticky header, full-width content |
| `md:` (768px+) | Tablet+ | Sidebar appears, header disappears, content offset |
| `lg:` (1024px+) | Desktop | Max grid columns, generous spacing |

### Grid Patterns

```
Stat cards:      grid-cols-2 md:grid-cols-4 gap-3
Clothing grid:   grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
Outfit grid:     grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
Shopping grid:   grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
Quick actions:   grid-cols-1 md:grid-cols-3 gap-3
```

---

## 10. Decorative Components

### RedPunct

```tsx
import { RedPunct } from "@/components/decorative/RedPunct";

// Renders red punctuation with font-display
<h1>iDrip<RedPunct>.</RedPunct></h1>
<h2>Login<RedPunct>:</RedPunct></h2>
```

### DiagonalCut

```tsx
import { DiagonalCut } from "@/components/decorative/DiagonalCut";

// Angular clip-path section
<DiagonalCut direction="top-right" className="p-8">
  Content with diagonal bottom edge
</DiagonalCut>
// Directions: top-left | top-right | bottom-left | bottom-right
```

### PeakDivider

```tsx
import { PeakDivider } from "@/components/decorative/PeakDivider";

// SVG mountain-peak zigzag between sections
<PeakDivider height={32} />
```

### FrostOverlay

```tsx
import { FrostOverlay } from "@/components/decorative/FrostOverlay";

// Glass overlay for hero images
<div className="relative">
  <img src="..." />
  <FrostOverlay blur="lg" opacity="light" />
</div>
// blur: sm | md | lg
// opacity: light | medium | heavy
```

---

## 11. Typography Utility Classes

```
text-display      → Citadel Script, 700, tracked wide, leading tight
text-overline     → Helvetica Now, 11px, 600, all caps, 0.12em tracking
dot-red           → Red color using --punctuation token
underline-red     → Red underline, 50% opacity, 4px offset
punctuation       → Red text (use as class on spans)
```

---

## 12. Adding New UI

### Decision Checklist

When building any new UI element, answer these in order:

1. **Typography:** Is there a display moment? Use `font-display` + `RedPunct`. Body? Use default sans stack.
2. **Surface:** Is it elevated? Use frost glass tokens. Flat? Use `bg-[hsl(var(--frost))]`.
3. **Interactive state:** Is it clickable? Active = glacier blue, hover = frost, inactive = muted.
4. **Borders:** Use `border-[hsl(var(--border)/0.4)]`. Never use pure white or black borders.
5. **Shadows:** Use `shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)]` for default. Escalate to glacier shadow for hover.
6. **Red:** Is this a punctuation moment? Use `RedPunct`. Is it a destructive action? Use `--punctuation` with border and subtle bg. Never use red as a decorative color outside these two cases.
7. **Animation:** New elements appearing on load? Add stagger. Transitions? 300ms default, 200ms for toggles.
8. **Dark mode:** If using semantic tokens (`--frost`, `--glacier`, `--peak`), dark mode is automatic. No `dark:` variants needed.

### Master Class String Reference

```
ACTIVE PILL:
"bg-[hsl(var(--glacier))] text-white border-transparent"

INACTIVE PILL:
"bg-[hsl(var(--frost)/0.5)] text-muted-foreground border-[hsl(var(--border)/0.4)] hover:bg-[hsl(var(--frost))]"

FROST CARD:
"bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] rounded-2xl shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)] transition-all duration-300"

FROST CARD HOVER:
"hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)] hover:scale-[1.02]"

FROST INPUT:
"bg-[hsl(var(--frost)/0.6)] border border-[hsl(var(--border)/0.4)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--glacier)/0.3)]"

DANGER ZONE:
"border border-[hsl(var(--punctuation)/0.3)] text-[hsl(var(--punctuation))] hover:bg-[hsl(var(--punctuation)/0.06)]"

PAGE BACKGROUND:
"bg-snowdrift"

SECTION HEADING:
"text-lg font-semibold"

PAGE HEADING:
"text-2xl font-bold"

LOGO / BRAND:
"font-display italic font-bold tracking-wide text-foreground"

SUBTLE ICON CONTAINER:
"bg-[hsl(var(--frost))]"
```

---

## 13. File Reference

| Concern | File |
|---|---|
| All tokens, fonts, utilities, animations | `frontend/src/index.css` |
| Font files (self-hosted) | `frontend/public/fonts/` |
| GlassCard (CVA component) | `frontend/src/components/glass/GlassCard.tsx` |
| GlassPanel | `frontend/src/components/glass/GlassPanel.tsx` |
| RedPunct | `frontend/src/components/decorative/RedPunct.tsx` |
| DiagonalCut | `frontend/src/components/decorative/DiagonalCut.tsx` |
| PeakDivider | `frontend/src/components/decorative/PeakDivider.tsx` |
| FrostOverlay | `frontend/src/components/decorative/FrostOverlay.tsx` |
| Classname merge helper | `frontend/src/lib/utils.ts` (cn function) |
| Tailwind v4 config | `frontend/src/index.css` (@theme inline block) |
| Google Fonts fallbacks | `frontend/index.html` |

---

*Last updated: 2026-05-14. This document overrides any prior design conventions. When in doubt, the CSS is authoritative — this document documents what the CSS does.*
