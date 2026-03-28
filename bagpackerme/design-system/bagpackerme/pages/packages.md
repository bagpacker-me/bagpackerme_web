# Design System Page Override — Packages Listing

> **LOGIC:** Rules here override `MASTER.md` where they conflict.
> For anything not mentioned, fall back to `MASTER.md`.

**Page:** Packages (`/packages`)
**Role:** Browse and filter all available travel packages
**Density:** Medium — comfortable browsing density

---

## Section Order & Rhythm

```
1.  PAGE HERO      → dark (full-bleed, shorter — 50vh)
2.  FILTER BAR     → white (sticky)
3.  PACKAGE GRID   → surface-light (#F7F9FA)
4.  CTA BANNER     → teal (#285056)
5.  FOOTER         → #1a1620
```

---

## 1. PAGE HERO

```
Height:      50vh (min: 400px)
Background:  Cinematic collage image + overlay + grain
Overlay:     rgba(34,30,42,0.65)
Layout:      centered vertically and horizontally

Eyebrow:     Section label (MASTER spec)
Heading:     "Every Journey, Curated" — Josefin Sans var(--text-h1), white
Subhead:     DM Sans var(--text-large), rgba(255,255,255,0.72), max-width: 44ch

Animation:   Same word-stagger as home hero but faster (0.06s stagger, 500ms duration)
```

---

## 2. FILTER BAR

```
Position:       sticky, top: 72px (below navbar)
Background:     #FFFFFF
Border-bottom:  1px solid rgba(34,30,42,0.08)
Height:         64px
Padding:        0 var(--section-padding-x)
Z-index:        40
Transition:     box-shadow 300ms (gains shadow on scroll)
```

### Filter Pill Chips

```
Style:          pill (border-radius: 9999px)
Default state:
  background:   transparent
  border:       1px solid rgba(34,30,42,0.14)
  color:        #4a5568
  font:         Josefin Sans 11px 600, tracking: 0.1em, UPPERCASE
  padding:      6px 16px

Active state:
  background:   #285056
  border-color: #285056
  color:        #FFFFFF

Hover:
  border-color: #285056
  color:        #285056
  transition:   200ms

Count badge:
  DM Sans 10px, background: #C1EA00, color: #221E2A
  border-radius: full, padding: 1px 6px, margin-left: 6px
```

### Filter Behavior

```
No page reload — client-side state only
Filter change → Framer Motion AnimatePresence + layoutId on cards
"Clear all" link: DM Sans 12px #718096, appears when any filter active
```

### Mobile Filter Bar

```
Overflow-x: scroll (horizontal pill scroll)
-webkit-overflow-scrolling: touch
scrollbar-width: none (hide scrollbar)
Padding: 12px 20px
```

---

## 3. PACKAGE GRID

```
Background:  #F7F9FA
Padding:     clamp(48px, 6vw, 80px) var(--section-padding-x)
Grid:        3 columns desktop | 2 columns tablet | 1 column mobile
Gap:         32px desktop | 24px tablet | 20px mobile
Card height: consistent (use 4/5 aspect on image, fixed body height)
Pagination:  12 cards per page, load more button or infinite scroll
```

### Framer Motion Grid Animation

```tsx
// Wrap grid with AnimatePresence
// Each card: layoutId={package.id} for smooth reorder
// Enter: opacity 0→1, y: 20→0, duration: 400ms
// Exit: opacity 1→0, scale: 0.95, duration: 300ms
// Stagger: 0.05s between cards
```

### Empty State

```
Background:  #F7F9FA (same section)
Icon:        Lucide MapPin, 48px, color: #0ED2E9
Heading:     Josefin Sans 22px 600, #221E2A
Body:        DM Sans 14px, #718096, max-width: 36ch, centered
CTA:         "Reset Filters" — Teal btn (MASTER spec)
Margin:      80px auto
```

### Load More / Pagination

```
Style:       Ghost btn on light (border: 1px solid #285056, color: #285056)
             Hover: bg #285056, color white
Placement:   Centered, margin-top: 48px
Loading:     Spinner replaces text, Lucide Loader2 icon animated
Firebase:    cursor-based pagination, limit: 12 per fetch
```

---

## 4. SORT DROPDOWN

```
Position:    Right side of filter bar
Component:   Custom dropdown (not native select)
Font:        DM Sans 13px, #4a5568
Options:     "Featured", "Price: Low to High", "Price: High to Low", "Duration", "Newest"
Arrow icon:  Lucide ChevronDown, 16px, animates 180° on open
Dropdown:    white, border: 1px solid rgba(34,30,42,0.1), shadow-md
             border-radius: 0, z-index: 41
```

---

## 5. CTA BANNER

```
Background:  #285056 (teal)
Padding:     clamp(64px, 8vw, 96px) var(--section-padding-x)
Layout:      flex space-between (desktop) | stacked centered (mobile)

Left:
  Eyebrow:   Section label (white variant — use #F7F9FA for line and text)
  Heading:   Josefin Sans var(--text-h2), white
  Body:      DM Sans 16px, rgba(255,255,255,0.72), max-width: 44ch

Right:
  CTA:       Lime btn "Plan Custom Journey"
  Sub-link:  Ghost btn "Talk to an Expert"
  Gap:       16px between buttons
```

---

## Component Overrides (vs MASTER)

| Component | MASTER | This Page |
|-----------|--------|-----------|
| Trip card image ratio | 4/5 | **4/5 maintained** — uniform grid height |
| Card hover translateY | -6px | -4px (subtle, grid density) |
| Section padding | `--section-padding-y` | Reduced on grid section — 48–80px |
| Filter items | N/A (not in MASTER) | Pill chips spec above |

---

## Performance Rules

- Firebase: query with `where` filter + `limit(12)` + `orderBy`
- Only re-fetch when filter changes (cache previous filter results in state)
- Skeleton cards: same 4/5 ratio as real cards, animated shimmer bg
- Images: `next/image`, `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
