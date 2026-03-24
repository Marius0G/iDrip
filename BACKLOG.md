# iDrip - Product Backlog & User Stories

## Epic 1: Virtual Wardrobe (Digital Closet)

### US-1.1: Upload Clothing Item with AI Auto-Detection
**As a** user,
**I want to** upload a photo of a clothing item and have the AI automatically detect its name, category, color, brand, tags, and season,
**So that** I can add items to my wardrobe quickly without manually filling in every field.

**Acceptance Criteria:**
- User can upload an image (drag-and-drop or file picker)
- Upon upload, an AI agent analyzes the photo and auto-fills: name, category, color, brand (if visible), tags (style descriptors), and recommended seasons
- User sees a loading/analyzing state while the AI processes the image
- All AI-detected fields are pre-filled but editable — user can override any field before saving
- User can optionally add notes manually
- Image is resized to max 400x400 and stored locally
- Item appears immediately in the wardrobe grid after saving
- Form validates that name is not empty before allowing submission
- If AI detection fails or is unavailable, the form falls back to manual entry

**Priority:** High
**Story Points:** 8
**Status:** To Do (currently manual-only upload is implemented)

---

### US-1.2: Browse Wardrobe
**As a** user,
**I want to** see all my clothing items in a visual grid,
**So that** I can quickly browse what I own.

**Acceptance Criteria:**
- Items displayed in a responsive grid (2 cols mobile, 3 tablet, 4 desktop)
- Each card shows: image, name, category, brand, up to 2 tags
- Cards have hover animation (scale + shadow)
- Grid loads mock data on first visit (18 items)
- Empty state shown when wardrobe is empty with CTA to add first item

**Priority:** High
**Story Points:** 3
**Status:** Done

---

### US-1.3: Filter & Search Wardrobe
**As a** user,
**I want to** filter my wardrobe by category and search by name/brand,
**So that** I can quickly find specific items.

**Acceptance Criteria:**
- Horizontal scrollable category filter pills (All, Tops, Bottoms, Outerwear, Dresses, Shoes, Accessories)
- Debounced search input (300ms) that filters by name, brand, and tags
- Filters can be combined (category + search)
- "No matches" empty state with reset filters button
- Filters persist during the session

**Priority:** High
**Story Points:** 3
**Status:** Done

---

### US-1.4: View Clothing Details
**As a** user,
**I want to** tap on a clothing item to see its full details,
**So that** I can review and manage individual items.

**Acceptance Criteria:**
- Slide-up sheet on mobile, side panel on desktop
- Shows: full image, name, brand, category, color, seasons, tags
- Backdrop blur overlay behind the panel
- Close button and tap-outside-to-close

**Priority:** Medium
**Story Points:** 3
**Status:** Done

---

### US-1.5: Delete Clothing Item
**As a** user,
**I want to** remove a clothing item from my wardrobe,
**So that** I can keep my digital wardrobe up to date.

**Acceptance Criteria:**
- Delete button visible in the detail sheet
- Item removed from store and grid immediately
- If item is part of an outfit, the outfit still exists but that slot becomes empty

**Priority:** Medium
**Story Points:** 2
**Status:** Done

---

### US-1.6: Edit Clothing Item
**As a** user,
**I want to** edit the details of a clothing item I already uploaded,
**So that** I can fix mistakes or update information.

**Acceptance Criteria:**
- Edit button in the detail sheet opens a pre-filled form
- All fields are editable (name, category, color, brand, tags, season)
- Image can be replaced
- Changes saved immediately to the store

**Priority:** Medium
**Story Points:** 3
**Status:** To Do

---

## Epic 2: AI Outfit Generator

### US-2.1: Generate Outfit with AI
**As a** user,
**I want to** have the AI generate an outfit from my wardrobe,
**So that** I get styling ideas without thinking.

**Acceptance Criteria:**
- User selects an occasion (Casual, Work, Formal, Date, Sport, Travel)
- User selects a season (All, Spring, Summer, Fall, Winter)
- "Generate Outfit with AI" button triggers generation
- Loading state: all outfit slots show pulse animation (1.5s delay)
- Result populates 3-5 slots (top + bottom + shoes, optionally outerwear/accessory)
- AI reasoning text displayed explaining the combination
- Style score (75-98) shown for the outfit
- Requires at least 1 top, 1 bottom, 1 shoes in wardrobe; button disabled otherwise

**Priority:** High
**Story Points:** 8
**Status:** Done

---

### US-2.2: View Outfit Builder Slots
**As a** user,
**I want to** see the outfit broken down by slot (Top, Bottom, Shoes, etc.),
**So that** I can understand the composition.

**Acceptance Criteria:**
- 5 slots displayed: Top, Bottom, Shoes, Outerwear, Accessory
- Empty slots show dashed border with "+" icon and label
- Filled slots show item image with name overlay at bottom
- Grid: 3 columns on mobile, 5 on desktop

**Priority:** High
**Story Points:** 3
**Status:** Done

---

### US-2.3: Save & Browse Outfits
**As a** user,
**I want to** save generated outfits and browse them later,
**So that** I can build a collection of go-to looks.

**Acceptance Criteria:**
- Generated outfits auto-saved to the store
- "Saved" tab shows all outfits in a grid (1/2/3 cols responsive)
- Each outfit card shows: overlapping item images, name, occasion, score, AI reasoning
- Delete button on each outfit card
- Empty state when no outfits saved

**Priority:** High
**Story Points:** 5
**Status:** Done

---

### US-2.4: Manually Build Outfit
**As a** user,
**I want to** manually select items for each slot,
**So that** I can create my own outfit combinations.

**Acceptance Criteria:**
- Clicking an empty slot opens a picker filtered to that category
- Clicking a filled slot allows swapping the item
- User can mix manual picks with AI-generated items
- "Clear" button resets all slots

**Priority:** Medium
**Story Points:** 5
**Status:** To Do

---

### US-2.5: Rate Outfit
**As a** user,
**I want to** rate an outfit (1-5 stars),
**So that** the AI can learn my preferences over time.

**Acceptance Criteria:**
- Star rating component on outfit cards
- Rating persisted in the store
- Ratings visible in saved outfits view

**Priority:** Low
**Story Points:** 2
**Status:** To Do

---

## Epic 3: Smart Shopping Recommendations

### US-3.1: View Shopping Recommendations
**As a** user,
**I want to** see AI-recommended clothing items to buy,
**So that** I can discover pieces that complement my wardrobe.

**Acceptance Criteria:**
- Grid of recommendation cards (2/3/4 cols responsive)
- Each card shows: image, name, brand, price, match score (%), AI reason
- Cards sorted by match score (highest first)
- Dismiss button (X) to remove a recommendation
- Empty state when no recommendations match filters

**Priority:** High
**Story Points:** 5
**Status:** Done

---

### US-3.2: Budget Control
**As a** user,
**I want to** set my monthly budget and see how much I've spent,
**So that** I stay within my financial limits.

**Acceptance Criteria:**
- Budget card shows: spent / total with progress bar
- Remaining amount prominently displayed
- Slider to adjust monthly budget ($50-$500, step $10)
- Recommendations filtered to show only items within remaining budget
- Budget persists across sessions (localStorage)

**Priority:** High
**Story Points:** 3
**Status:** Done

---

### US-3.3: Style Preference Filtering
**As a** user,
**I want to** select my style preferences,
**So that** recommendations match my personal taste.

**Acceptance Criteria:**
- Multi-select style tag pills: Casual, Formal, Streetwear, Minimalist, Bohemian, Sporty, Vintage, Preppy
- Selected styles influence recommendation order
- Preferences synced between Shopping and Profile pages
- Persisted in localStorage

**Priority:** Medium
**Story Points:** 3
**Status:** Done

---

### US-3.4: Purchase Tracking
**As a** user,
**I want to** mark a recommended item as purchased and have it added to my wardrobe,
**So that** my wardrobe and budget stay in sync.

**Acceptance Criteria:**
- "Bought it" button on recommendation cards
- Creates a new wardrobe item with recommendation details
- Deducts price from remaining budget
- Recommendation removed from the list

**Priority:** Medium
**Story Points:** 5
**Status:** To Do

---

## Epic 4: User Profile & Settings

### US-4.1: View Profile
**As a** user,
**I want to** see my profile information and wardrobe statistics,
**So that** I have an overview of my account.

**Acceptance Criteria:**
- Avatar with initial, name, and email displayed
- Wardrobe breakdown chart: items per category with progress bars
- Total item counts per category

**Priority:** Medium
**Story Points:** 3
**Status:** Done

---

### US-4.2: Theme Toggle
**As a** user,
**I want to** switch between light, dark, and system themes,
**So that** the app matches my visual preference.

**Acceptance Criteria:**
- Three options: Light (Sun icon), Dark (Moon icon), System (Monitor icon)
- Active theme highlighted
- Theme applied immediately (`.dark` class on root)
- Persisted in localStorage

**Priority:** Medium
**Story Points:** 2
**Status:** Done

---

### US-4.3: Edit Preferences
**As a** user,
**I want to** update my style preferences and budget from my profile,
**So that** I have a central place for settings.

**Acceptance Criteria:**
- Style tag selector (same as Shopping page, synced)
- Budget input field with currency
- Changes reflected across all pages immediately

**Priority:** Medium
**Story Points:** 2
**Status:** Done

---

### US-4.4: Clear All Data
**As a** user,
**I want to** reset all my data,
**So that** I can start fresh.

**Acceptance Criteria:**
- "Clear All Data" button in Danger Zone section
- Confirmation dialog before proceeding
- Clears all localStorage (wardrobe, outfits, shopping, user)
- Reloads the app with default mock data

**Priority:** Low
**Story Points:** 1
**Status:** Done

---

## Epic 5: Dashboard & Navigation

### US-5.1: Dashboard Overview
**As a** user,
**I want to** see a summary of my wardrobe on the home page,
**So that** I get a quick overview when I open the app.

**Acceptance Criteria:**
- Greeting: "Welcome back, {name}"
- 4 stat cards: Total Items, Total Outfits, Budget Remaining, Items This Week
- Recent outfits horizontal carousel (last 5)
- Quick action buttons: Upload Clothing, Generate Outfit, Browse Recommendations
- Empty state if wardrobe is empty

**Priority:** High
**Story Points:** 5
**Status:** Done

---

### US-5.2: Responsive Navigation
**As a** user,
**I want to** navigate between pages using a sidebar (desktop) or bottom bar (mobile),
**So that** the app feels native on any device.

**Acceptance Criteria:**
- Desktop: Fixed left sidebar (w-64) with logo, 5 nav links, profile at bottom
- Mobile: Fixed bottom tab bar with 5 icons + labels
- Active route highlighted (solid fill)
- Glass morphism effect on both nav components
- Smooth transitions between routes

**Priority:** High
**Story Points:** 5
**Status:** Done

---

## Epic 6: Backend API

### US-6.1: Wardrobe CRUD API
**As a** frontend developer,
**I want** REST endpoints for wardrobe items,
**So that** the frontend can persist data server-side.

**Acceptance Criteria:**
- `GET /api/wardrobe` — list all items (with optional category/season filters)
- `GET /api/wardrobe/:id` — get single item
- `POST /api/wardrobe` — create item
- `PUT /api/wardrobe/:id` — update item
- `DELETE /api/wardrobe/:id` — delete item
- All scoped to demo user

**Priority:** High
**Story Points:** 5
**Status:** Done

---

### US-6.2: Outfit Generation API
**As a** frontend developer,
**I want** an endpoint that generates outfit combinations,
**So that** outfit logic can run server-side.

**Acceptance Criteria:**
- `POST /api/outfits/generate` — accepts occasion + season, returns populated outfit
- Picks random items by category from user's wardrobe
- Generates style score (75-98) and reasoning text from templates
- `GET /api/outfits` — list saved outfits
- `PATCH /api/outfits/:id/save` — toggle saved status
- `DELETE /api/outfits/:id` — delete outfit

**Priority:** High
**Story Points:** 5
**Status:** Done

---

### US-6.3: Recommendations API
**As a** frontend developer,
**I want** an endpoint for shopping recommendations,
**So that** recommendations can be filtered server-side.

**Acceptance Criteria:**
- `GET /api/recommendations` — returns hardcoded recommendations
- Supports `?budget=N` to filter by max price
- Supports `?style=X` to filter by style
- Sorted by match score descending

**Priority:** Medium
**Story Points:** 3
**Status:** Done

---

### US-6.4: User Preferences API
**As a** frontend developer,
**I want** endpoints to read and update user preferences,
**So that** settings persist across sessions.

**Acceptance Criteria:**
- `GET /api/users/me` — returns demo user profile
- `PUT /api/users/me/preferences` — updates style/budget/size preferences

**Priority:** Medium
**Story Points:** 2
**Status:** Done

---

### US-6.5: Database Seeding
**As a** developer,
**I want** the database to be seeded with demo data on startup,
**So that** the app has content for demos without manual setup.

**Acceptance Criteria:**
- Seed runs automatically on server start
- Idempotent: skips if demo user already exists
- Creates: 1 user, 12 wardrobe items, 2 outfits
- 8 hardcoded recommendations (not in DB)

**Priority:** High
**Story Points:** 3
**Status:** Done

---

## Epic 7: Authentication (Future)

### US-7.1: User Registration
**As a** new user,
**I want to** create an account with email and password,
**So that** my wardrobe data is private and persistent.

**Priority:** High
**Story Points:** 8
**Status:** To Do

---

### US-7.2: User Login
**As a** returning user,
**I want to** log in with my credentials,
**So that** I can access my wardrobe from any device.

**Priority:** High
**Story Points:** 5
**Status:** To Do

---

## Epic 8: AI Integration (Future)

### US-8.1: Real AI Outfit Generation
**As a** user,
**I want** outfits generated by a real AI model (not random),
**So that** combinations are genuinely stylish and personalized.

**Priority:** High
**Story Points:** 13
**Status:** To Do

---

### US-8.2: AI Clothing Recognition Agent
**As a** user,
**I want** an AI agent to analyze my uploaded clothing photo and automatically generate the item's name, category, color, brand, tags, and season,
**So that** I don't have to manually describe every piece of clothing I add.

**Acceptance Criteria:**
- AI agent receives the uploaded image via the `ai-service` (Python/LangChain)
- Agent uses a vision-capable LLM (e.g., GPT-4V, Claude Vision) to analyze the photo
- Agent returns a structured JSON response:
  ```json
  {
    "name": "Black Oversized Graphic Tee",
    "category": "tops",
    "subcategory": "t-shirt",
    "color": "black",
    "brand": "Nike" | null,
    "tags": ["streetwear", "casual", "graphic"],
    "season": ["summer", "spring", "fall"],
    "confidence": 0.92
  }
  ```
- If brand is visible (logo/label in photo), the agent detects it; otherwise returns null
- Tags describe the style (casual, formal, streetwear, etc.) and material if detectable
- Season is inferred from fabric weight/style (e.g., heavy knit = winter, linen = summer)
- Confidence score (0-1) indicates how certain the agent is about the detection
- Response time target: under 5 seconds
- Graceful fallback: if the AI service is down or confidence < 0.5, frontend falls back to manual entry with a notice

**Technical Notes:**
- Backend endpoint: `POST /api/ai/analyze-clothing` accepts image (base64 or multipart)
- Backend forwards to `ai-service` at `http://ai-service:8000/analyze`
- `ai-service` uses LangChain with a vision model to process the image
- LangGraph agent chain: Image Input → Vision Analysis → Structured Output Parser → JSON Response

**Priority:** High
**Story Points:** 13
**Status:** To Do

---

### US-8.2.1: Clothing Analysis API Endpoint
**As a** frontend developer,
**I want** a backend endpoint that accepts a clothing image and returns AI-detected metadata,
**So that** the upload form can be pre-filled with AI suggestions.

**Acceptance Criteria:**
- `POST /api/ai/analyze-clothing` — accepts `{ image: string }` (base64 data URL)
- Proxies the request to the Python `ai-service` at `http://ai-service:8000/analyze`
- Returns the structured clothing metadata JSON from the AI agent
- Returns HTTP 503 with fallback message if `ai-service` is unavailable
- Request timeout: 10 seconds
- Rate limited: max 10 requests per minute per user

**Priority:** High
**Story Points:** 5
**Status:** To Do

---

### US-8.2.2: AI Service - Vision Analysis Agent
**As a** backend developer,
**I want** a Python service that uses LangChain/LangGraph to analyze clothing images,
**So that** the platform has AI-powered item recognition.

**Acceptance Criteria:**
- `POST /analyze` endpoint in the Python `ai-service`
- Uses LangChain with a vision-capable model (configurable via environment variable)
- LangGraph agent flow:
  1. **Image Preprocessor** — validates and resizes the image
  2. **Vision Analyzer** — sends image to LLM with a structured prompt requesting clothing attributes
  3. **Output Parser** — parses LLM response into the standard JSON schema
  4. **Confidence Scorer** — evaluates parsing quality and assigns confidence score
- Structured prompt instructs the model to identify: item type, color(s), brand, style tags, seasonality
- Output validated against a Pydantic schema before returning
- Dockerized and accessible within the Docker Compose network
- Health check endpoint: `GET /health`
- Environment variables: `LLM_MODEL`, `LLM_API_KEY`, `LLM_BASE_URL`

**Priority:** High
**Story Points:** 13
**Status:** To Do

---

### US-8.3: Real Shopping Recommendations
**As a** user,
**I want** recommendations based on real product data from online stores,
**So that** I can actually purchase suggested items.

**Priority:** Medium
**Story Points:** 13
**Status:** To Do

---

## Summary

| Epic | Total Stories | Done | To Do |
|------|:---:|:---:|:---:|
| 1. Virtual Wardrobe | 6 | 4 | 2 |
| 2. AI Outfit Generator | 5 | 3 | 2 |
| 3. Smart Shopping | 4 | 3 | 1 |
| 4. User Profile | 4 | 4 | 0 |
| 5. Dashboard & Nav | 2 | 2 | 0 |
| 6. Backend API | 5 | 5 | 0 |
| 7. Authentication | 2 | 0 | 2 |
| 8. AI Integration | 5 | 0 | 5 |
| **Total** | **33** | **21** | **12** |
