# BagPackerMe — Public Website Documentation

> **Experiential Journeys Through India**
> A customer-facing travel platform built with Next.js 14, React 18, TypeScript, TailwindCSS, Framer Motion, and Firebase.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Route Map](#route-map)
- [Pages](#pages)
  - [Homepage](#homepage-)
  - [Packages Listing](#packages-listing-packages)
  - [Package Detail](#package-detail-packagesslug)
  - [Blog Listing](#blog-listing-blog)
  - [Blog Post](#blog-post-blogslug)
  - [About](#about-about)
  - [Contact](#contact-contact)
- [Navigation & Layout](#navigation--layout)
- [Design System](#design-system)
- [SEO](#seo)
- [Data Layer](#data-layer)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Technology | Version | Role |
|-----------|---------|------|
| Next.js (App Router) | 14.2.35 | Framework — SSR/SSG, file-based routing |
| React | 18 | UI library |
| TypeScript | — | Type safety |
| TailwindCSS | 3.4.x | Utility-first styling, dark mode (`class` strategy) |
| Framer Motion | 12.x | Scroll animations, parallax, page transitions, reduced-motion support |
| Firebase | 12.x | Authentication, Firestore (database), Storage (images), Analytics |
| TipTap | 3.x | Rich text editor (blog/package content) |
| React Hook Form | 7.x | Form management |
| Zod | 4.x | Schema validation (contact form) |
| date-fns | 4.x | Date formatting |
| react-hot-toast | 2.6 | Toast notifications |
| slugify | — | URL-friendly slug generation |
| Lucide React | — | Icon library |
| next-themes | — | Theme provider (dark mode) |

---

## Project Structure

```
app/
├── (public)/                     # Public route group
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Public layout (Navbar + Footer)
│   ├── loading.tsx               # Loading state (animated logo)
│   ├── error.tsx                 # Error boundary
│   ├── packages/
│   │   ├── page.tsx              # Packages listing
│   │   └── [slug]/
│   │       ├── page.tsx          # Package detail
│   │       └── _components/      # Detail sub-sections (8 components)
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   ├── [slug]/page.tsx       # Blog post
│   │   └── _components/          # Blog sub-components
│   ├── about/page.tsx            # About page
│   └── contact/page.tsx          # Contact page
├── not-found.tsx                 # Custom 404
├── sitemap.ts                    # Dynamic sitemap
├── robots.ts                     # robots.txt
└── layout.tsx                    # Root layout

components/
├── home/                         # Homepage sections
│   ├── HeroSection.tsx
│   ├── StatsSection.tsx
│   ├── FeaturedTrips.tsx
│   ├── PackageCard.tsx
│   ├── AboutSection.tsx
│   ├── WhatWeDo.tsx
│   ├── BlogPreview.tsx
│   ├── AudienceSplit.tsx
│   └── NewsletterSection.tsx
├── layout/
│   ├── Navbar.tsx                # Main navigation
│   ├── Footer.tsx                # Site footer
│   └── PageTransition.tsx        # Framer Motion page transitions
├── packages/
│   └── PackageCard.tsx           # Package card component
└── ui/
    ├── Logo.tsx                  # Brand logo (light/dark variants)
    ├── FadeInSection.tsx         # Scroll-triggered fade animation
    └── WhatsAppButton.tsx        # Floating WhatsApp CTA

lib/
├── firebase.ts                   # Firebase initialization
├── auth.ts                       # Auth helpers
└── firestore.ts                  # Firestore queries & operations

hooks/
└── useAuth.ts                    # Auth state hook

types/
└── index.ts                      # TypeScript interfaces

styles/
└── globals.css                   # Design tokens + global styles
```

---

## Route Map

| Path | Page | Description | Key Components |
|------|------|-------------|----------------|
| `/` | Homepage | Marketing landing page with 8 sections | HeroSection, StatsSection, FeaturedTrips, AboutSection, WhatWeDo, BlogPreview, AudienceSplit, NewsletterSection |
| `/packages` | Packages Listing | Filterable trip catalog | Sticky filter bar (category + duration), PackageCard grid |
| `/packages/[slug]` | Package Detail | Full trip detail with booking | HeroSection, StickyNav, OverviewSection, ItineraryTimeline, WhatsIncluded, PackageGallery, BookingForm, RelatedPackages |
| `/blog` | Blog Listing | Searchable, paginated blog hub | BlogListingClient (category filter, search, pagination) |
| `/blog/[slug]` | Blog Post | Individual article with sidebar | Hero, content, ShareButtons, RelatedPosts, NewsletterCard |
| `/about` | About | Company story and founder profile | Hero, Story, Founder, Impact stats, Media (YouTube), CTA |
| `/contact` | Contact | Enquiry form with contact info | Zod-validated form, sticky sidebar with Google Maps |

**Special Pages:**

| Path | Description |
|------|-------------|
| `/not-found` | Custom 404 — "Lost on the Trail?" with CTAs to Home and Trips |
| Error boundary | "Unexpected Error" with retry and home buttons |
| Loading state | Animated pulsing logo with brand name |

---

## Pages

### Homepage (`/`)

**File:** `app/(public)/page.tsx`

A long-form marketing page composed of 8 sections rendered in sequence:

#### 1. HeroSection
**File:** `components/home/HeroSection.tsx`

- Full-viewport hero with parallax scrolling background (`useScroll` + `useTransform`)
- Animated headline: **"EXPERIENTIAL JOURNEYS THROUGH INDIA"** — word-by-word stagger animation (0.11s delay per word)
- CTA buttons for exploration
- Scroll indicator with animated line (`heroScrollLineGrow` keyframe)
- Reduced-motion fallback: instant rendering, no parallax

#### 2. StatsSection
**File:** `components/home/StatsSection.tsx`

- 4 animated counter stats using `useMotionValue` + `useSpring`:
  - **1,200+** Travelers Hosted
  - **25+** Destinations
  - **4.9** Satisfaction Rating
  - **2020** Founded
- Counters trigger on scroll into viewport

#### 3. FeaturedTrips
**File:** `components/home/FeaturedTrips.tsx`

- Displays up to 6 published packages fetched from Firestore (`getFeaturedPackages`)
- Responsive grid using `PackageCard` components
- Skeleton loaders during data fetch
- "View All Trips" CTA linking to `/packages`

#### 4. AboutSection
**File:** `components/home/AboutSection.tsx`

- Brand narrative and company mission
- CTA buttons

#### 5. WhatWeDo
**File:** `components/home/WhatWeDo.tsx`

- 3 service cards with Lucide icons:
  - **Curated Trips** (Compass icon)
  - **Travel Media** (Newspaper icon)
  - **Local Expertise** (MapPin icon)
- Each card has a descriptive paragraph

#### 6. BlogPreview
**File:** `components/home/BlogPreview.tsx`

- Shows 3 most recent published blog posts (`getRecentPublishedBlogs`)
- Card layout with featured image, title, excerpt
- "View All" CTA linking to `/blog`

#### 7. AudienceSplit
**File:** `components/home/AudienceSplit.tsx`

- Highlights different traveler personas/segments

#### 8. NewsletterSection
**File:** `components/home/NewsletterSection.tsx`

- Email subscription form
- Tagline: "Join 2,000+ travelers"
- Writes to `subscribers` Firestore collection

---

### Packages Listing (`/packages`)

**File:** `app/(public)/packages/page.tsx`

#### Hero
- Background image with dark overlay
- Heading: **"Curated Trips Across India"**
- Subtitle about intentional journeys

#### Sticky Filter Bar
- **Category filter** — pill buttons:
  - All, Culinary, Spiritual, Adventure, Heritage, Hippy Trail
- **Duration filter** — dropdown:
  - Any, Short (1–7 days), Medium (8–13 days), Long (14+ days)
- Duration parsing via `parseDurationDays` helper (converts strings like "5 Days / 4 Nights" to numeric days)

#### Package Grid
- Responsive 3-column grid (scales to 1 column on mobile)
- Results counter: "[N] Journeys Found"
- Animated filtering with `CARD_GRID_VARIANTS` and `CARD_ITEM_VARIANTS` (Framer Motion layout animations)
- Empty state with "Reset Filters" button
- Skeleton loaders during data fetch

#### PackageCard
**File:** `components/home/PackageCard.tsx`

- Hero image with hover zoom (`img-zoom` class)
- Package title, category badge, duration
- Price display
- "View Details" CTA linking to `/packages/[slug]`

---

### Package Detail (`/packages/[slug]`)

**File:** `app/(public)/packages/[slug]/page.tsx`

Fetches package data via `getPackageBySlug(slug)` and renders 8 sub-components from `_components/`:

| Section | Component | Description |
|---------|-----------|-------------|
| 1 | `HeroSection` | Large hero image with overlay, package title, key info |
| 2 | `StickyNav` | Anchor navigation bar, follows scroll position |
| 3 | `OverviewSection` | Package summary, pricing (INR/USD), key details |
| 4 | `ItineraryTimeline` | Day-by-day timeline with location, description, optional images |
| 5 | `WhatsIncluded` | Inclusions (accommodation, meals, transfers, guides, flights, activities) and exclusions list |
| 6 | `PackageGallery` | Photo gallery from `galleryUrls` |
| 7 | `BookingForm` | Enquiry/booking form linked to this package |
| 8 | `RelatedPackages` | Up to 3 packages from the same category (`getRelatedPackages`) |

---

### Blog Listing (`/blog`)

**File:** `app/(public)/blog/page.tsx`

#### Hero
- Dark background with subtle glow effects
- Heading: **"Stories from the Road"**
- Subtitle about travel stories and inspiration

#### BlogListingClient
**File:** `app/(public)/blog/_components/BlogListingClient.tsx`

- **Category filter** — 7 categories:
  - All, Adventure, Culture, Food, Spiritual, Tips & Guides, Corporate Travel
- **Search** — filters by title or excerpt
- **Featured post layout** — when viewing "All" with no search, the first post gets a hero-sized card treatment
- **Pagination** — 6 posts per page with prev/next navigation
- **Newsletter card** — embedded subscription prompt within the listing

**Data source:** `getPublishedBlogs()` — sorted by `createdAt` or `publishDate` descending

---

### Blog Post (`/blog/[slug]`)

**File:** `app/(public)/blog/[slug]/page.tsx`

- **Hero:** Featured image, post title, metadata (publication date, reading time, author)
- **Content:** Rich HTML rendered with custom Tailwind prose styling (headings, blockquotes, lists, images, links)
- **Sidebar:**
  - Share buttons (social sharing) via `ShareButtons` component
  - Related posts (up to 3 from same category) via `getRelatedBlogs`
- **Newsletter card:** Mid-content subscription prompt

**Data source:** `getBlogBySlug(slug)`

---

### About (`/about`)

**File:** `app/(public)/about/page.tsx`

6 sections:

#### 1. Hero Section
- Large background image with dark overlay
- Heading: **"We Are Bagpackerme"**
- Subtitle about the community

#### 2. Our Story
- Image gallery (1 large + 2 smaller images)
- "EST. 2020" badge
- Story narrative with highlighted stats: **1,200+ travelers**, **25+ destinations**
- 3 feature cards: Community, Responsible, Founder-Led

#### 3. Founder Section
- Founder photo with hover scale effect
- "Founder" badge
- **Kevin** — bio and quote
- Social links: Instagram, YouTube, WhatsApp

#### 4. Impact Section ("By the Numbers")
- Teal background with 4 animated counter stats:
  - 1,200+ Travellers
  - 25+ Destinations
  - 4.5 Avg Rating
  - 2020 Founded

#### 5. Media Section
- Embedded YouTube player — "Watch Our Series: Balancing the Act"
- Link to YouTube channel

#### 6. CTA Section
- Heading: **"Ready for Your Next Journey?"**
- Two buttons:
  - "Explore Trips" (lime button → `/packages`)
  - "Chat on WhatsApp" (ghost button → WhatsApp)

---

### Contact (`/contact`)

**File:** `app/(public)/contact/page.tsx`

#### Header
- Dark background
- Heading: **"Get in Touch"**

#### Two-Column Layout

**Left Column (60%) — Contact Form:**
- Heading: "Let's Start a Conversation"
- Subtext: "Fill in the form below and Kevin will personally respond within 24 hours."
- **Zod-validated fields:**
  - Full Name (min 2 chars)
  - Email (valid email format)
  - Phone (Indian format: `+91` followed by 10 digits starting with 6-9)
  - Inquiry Type dropdown: Group Trip, Personalised Itinerary, Corporate Retreat, Media & Partnership, Other
  - Message (min 20 chars)
- Submit button with loading state
- **Success state:** Animated checkmark, "Message Received!" confirmation, WhatsApp link as alternative
- **Error handling:** Field-level validation with shake animation
- **Data:** Writes to `enquiries` Firestore collection via `createEnquiry`

**Right Column (40%) — Sticky Sidebar:**
- Contact info card (teal background):
  - Email: partnerships@bagpackerme.com
  - Location: Mumbai, India
  - Website: www.bagpackerme.com
  - WhatsApp button: +91 9920992026
  - Social icons: Instagram, YouTube
  - Embedded Google Maps (Mumbai)

---

## Navigation & Layout

### Public Layout
**File:** `app/(public)/layout.tsx`

Wraps all public pages with:
- `<Navbar />` — fixed navigation
- `<PageTransition />` — Framer Motion page animation wrapper
- `<main>` — flex-grow content area
- `<Footer />` — site footer
- `<WhatsAppButton />` — floating WhatsApp CTA

### Navbar
**File:** `components/layout/Navbar.tsx`

- **Fixed position** with scroll-linked transparency:
  - At top: fully transparent background
  - After 80px scroll: `rgba(34,30,42,0.95)` with 12px backdrop blur
  - Interpolated via `useTransform` for smooth transition
- **Desktop nav links:** Home, Trips, Blog, About
- **Active route indicator:** Motion-animated underline dot via `layoutId="nav-indicator"`
- **CTA button:** "Book a Trip →" linking to `/contact` (lime background, hover glow)
- **Social icons:** Instagram, WhatsApp
- **Mobile:** Full-screen overlay with circular clip-path reveal animation, staggered link entrance
- **Reduced-motion fallback:** Falls back to instant state changes
- **Logo:** Scales 65% on mobile, 100% on desktop

### Footer
**File:** `components/layout/Footer.tsx`

4-column responsive grid:

| Column | Content |
|--------|---------|
| **Brand** | Logo, tagline "Experiential Journeys Through India", social icons (Instagram, YouTube, X/Twitter, WhatsApp), "Based in Mumbai, India" |
| **Explore** | All Packages, Culinary Trail, Spiritual Circuit, Adventure Route, Heritage Walk, Hippy Trail |
| **Company** | About, Blog, Media, Partnerships, Contact |
| **Get In Touch** | Email (partnerships@bagpackerme.com), WhatsApp (+91 9920992026), Website, newsletter form ("Join 2,000+ travelers") |

**Bottom bar:** Copyright notice, Privacy Policy link, Terms link

### Global UI Components

| Component | File | Description |
|-----------|------|-------------|
| `WhatsAppButton` | `components/ui/WhatsAppButton.tsx` | Floating green WhatsApp button (bottom-right) |
| `FadeInSection` | `components/ui/FadeInSection.tsx` | Reusable scroll-triggered fade-in animation wrapper, supports staggered grids |
| `PageTransition` | `components/layout/PageTransition.tsx` | Framer Motion page entrance/exit animations |
| `Logo` | `components/ui/Logo.tsx` | Brand logo with light and dark variants |

---

## Design System

### Color Palette

| Token | Hex | Role |
|-------|-----|------|
| **Teal** (Primary) | `#285056` | Primary brand color, headings, buttons |
| Teal Dark | `#1e3d42` | Hover states |
| Teal Light | `#3a6e76` | Lighter variant |
| **Lime** (Accent) | `#C1EA00` | CTAs, active indicators, badges, highlights |
| Lime Hover | `#afd100` | Button hover state |
| **Cyan** (Highlight) | `#0ED2E9` | Section labels, links, decorative elements |
| **Void** (Dark) | `#221E2A` | Dark backgrounds, text on light surfaces |
| **Ice** (Light) | `#E9F5F7` | Light backgrounds, cards |
| White | `#FFFFFF` | Primary light surface |
| Off-white | `#F7F9FA` | Secondary light surface |

### Typography

**Font Families:**

| Font | CSS Variable | Role | Usage |
|------|-------------|------|-------|
| Josefin Sans | `--font-display` | Display / Heading | Headings, nav links, labels, badges, buttons, section labels |
| DM Sans | `--font-body` | Body | Paragraphs, card descriptions, UI copy, metadata |
| Cormorant Garamond | `--font-accent` | Accent / Script | Pull quotes, taglines (italic only) |

**Type Scale (fluid `clamp` values):**

| Token | Size |
|-------|------|
| `--text-hero` | `clamp(52px, 8.5vw, 104px)` |
| `--text-display` | `clamp(40px, 6vw, 80px)` |
| `--text-h1` | `clamp(32px, 4.5vw, 64px)` |
| `--text-h2` | `clamp(26px, 3.5vw, 48px)` |
| `--text-h3` | `clamp(20px, 2.5vw, 32px)` |
| `--text-h4` | `clamp(16px, 2vw, 24px)` |
| `--text-large` | `clamp(17px, 1.5vw, 20px)` |
| `--text-base` | `16px` |
| `--text-small` | `14px` |
| `--text-xs` | `12px` |
| `--text-xxs` | `11px` |

### Design Conventions

- **No rounded corners** — `border-radius: 0` on cards, buttons, and badges (`--radius-card: 0px`, `--radius-button: 0px`)
- **Section labels** — `.section-label` class: 32px cyan line + 11px uppercase Josefin Sans, `#0ED2E9` color, 0.22em letter-spacing
- **Pull quotes** — Cormorant Garamond italic, 3px lime left border, no quotation marks
- **Image zoom** — `.img-zoom` class: 6% scale on hover with smooth transition
- **Grain overlay** — `.grain` class: subtle SVG noise texture on dark sections
- **Focus ring** — Global `*:focus-visible`: 2px solid lime outline with 2px offset (WCAG AA)
- **Stat numbers** — `oldstyle-nums` font variant, lime-colored "+" suffix
- **Buttons:**
  - `.btn-lime` / `.btn-primary` — Lime background, void text, hover lift + glow
  - `.btn-ghost` — Transparent with white border, hover background fill
  - `.btn-teal` — Teal background, white text, hover darken + shadow

---

## SEO

### Sitemap
**File:** `app/sitemap.ts`

Dynamically generates XML sitemap including:
- Static pages: `/`, `/packages`, `/blog`, `/about`, `/contact`
- All published packages: `/packages/[slug]`
- All published blog posts: `/blog/[slug]`

**Base URL:** `https://bagpackerme.com`

### Robots
**File:** `app/robots.ts`

- **Allow:** `/`
- **Disallow:** `/admin/`, `/api/`

### Metadata
- Per-page metadata via `export const metadata` objects
- OpenGraph tags configured per page

---

## Data Layer

The public website interacts with Firebase Firestore through `lib/firestore.ts`:

### Read Operations (public pages)

| Function | Collection | Used By |
|----------|-----------|---------|
| `getPublishedPackages()` | `packages` | Packages listing page |
| `getFeaturedPackages(count)` | `packages` | Homepage FeaturedTrips |
| `getPackageBySlug(slug)` | `packages` | Package detail page |
| `getRelatedPackages(category, excludeSlug, count)` | `packages` | Package detail — related trips |
| `getPublishedBlogs()` | `blogs` | Blog listing page |
| `getRecentPublishedBlogs(count)` | `blogs` | Homepage BlogPreview |
| `getBlogBySlug(slug)` | `blogs` | Blog post page |
| `getRelatedBlogs(category, excludeSlug, count)` | `blogs` | Blog post — related articles |

### Write Operations (user-generated)

| Function | Collection | Used By |
|----------|-----------|---------|
| `createEnquiry(data)` | `enquiries` | Contact form, Booking form |
| `createSubscriber(data)` | `subscribers` | Newsletter forms (footer, blog, homepage) |

### Data Filtering
- Only **published** packages and blogs are visible on the public site (filtered via `where('status', '==', 'published')`)
- Blog sorting is done client-side (JS sort by `createdAt` or `publishDate`) to avoid Firestore composite index requirements

---

## Environment Variables

All environment variables are prefixed with `NEXT_PUBLIC_` for client-side access:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |

### Image Domains

Configured in `next.config.mjs`:
- `images.unsplash.com`
- `firebasestorage.googleapis.com`
