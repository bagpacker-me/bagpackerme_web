# Design System Page Override — Home

> **LOGIC:** Rules here override `MASTER.md` where they conflict.
> For anything not mentioned, fall back to `MASTER.md`.

**Page:** Home (`/`)
**Role:** Primary brand entry point — convert browsers to inquirers
**Density:** Airy — generous negative space throughout

---

## Section Order & Rhythm

```
1.  HERO           → dark (full-bleed cinematic)
2.  STATS          → teal (#285056 bg)
3.  FEATURED TRIPS → white (#FFFFFF)
4.  ABOUT          → dark (#221E2A) + grain
5.  RETREATS       → ice (#E9F5F7)
6.  SERVICES       → dark (#221E2A) + grain
7.  BLOG           → white (#FFFFFF)
8.  AUDIENCE       → split (left: teal, right: white)
9.  NEWSLETTER     → dark (#221E2A) + grain
10. FOOTER         → #1a1620 (surface-darker)
```

> ⚠️ Strict alternation — no two same-color sections adjacent.
> Stats (teal) breaking the dark→light→dark rhythm is intentional brand moment.

---

## 1. HERO SECTION

```
Layout:     100vh (minimum), full-bleed
Background: Cinematic travel image + dark overlay + grain
Overlay:    linear-gradient(to bottom, rgba(34,30,42,0.55) 0%, rgba(34,30,42,0.75) 100%)
```

### Hero Animation Sequence (on page load)

| Element | Animation | Delay | Duration |
|---------|-----------|-------|----------|
| Section label (eyebrow) | fadeIn + slideUp(20px) | 0ms | 600ms |
| Headline word 1 | slideUp(40px) + fadeIn | 100ms | 700ms |
| Headline word 2 | slideUp(40px) + fadeIn | 200ms | 700ms |
| Headline word 3 | slideUp(40px) + fadeIn | 300ms | 700ms |
| Subheadline | fadeIn | 500ms | 600ms |
| CTA buttons | fadeIn + slideUp(16px) | 700ms | 500ms |
| Scroll indicator | fadeIn | 1000ms | 400ms |

### Hero Typography

```
Eyebrow:    Josefin Sans 11px 700 tracking-widest UPPERCASE, cyan #0ED2E9
Headline:   Josefin Sans, var(--text-hero), weight 700
            tracking: -0.03em, line-height: 0.95
            color: #FFFFFF
            text-wrap: balance
Tagline:    Cormorant Garamond italic, clamp(18px, 2vw, 24px), weight 300
            color: rgba(255,255,255,0.82)
            margin-top: 24px, max-width: 560px
```

### Hero CTA Row

```
Primary CTA:  "Start Your Journey" — Lime btn (full spec in MASTER)
Ghost CTA:    "View Packages" — Ghost btn (full spec in MASTER)
Gap between:  24px
Margin-top:   40px
```

### Hero Parallax

- Background image moves at 0.4x scroll speed (Framer Motion `useScroll` / CSS `parallax`)
- Image must be `next/image` with `priority` and `fill`
- `sizes="100vw"`, `quality={90}`

### Scroll Indicator

```
Position:   absolute bottom-8 left-50% translateX(-50%)
Content:    animated down-arrow SVG (Lucide ChevronDown)
Color:      rgba(255,255,255,0.5)
Animation:  translateY(0→8px) infinite, 1.5s ease-in-out alternate
```

---

## 2. STATS SECTION

```
Background:  #285056 (teal)
Padding:     clamp(64px, 8vw, 96px) var(--section-padding-x)
Layout:      4 stats in a row (desktop), 2×2 grid (mobile)
```

### Stat Item

```
Number:   Josefin Sans, clamp(40px, 5vw, 64px), weight 700, color: #C1EA00
Label:    DM Sans 14px, weight 400, color: rgba(255,255,255,0.75), margin-top: 8px
Divider:  1px vertical line rgba(255,255,255,0.15) between items (hidden mobile)
```

### Counter Animation

- Count up from 0 on scroll-into-view
- Duration: 1800ms, easing: ease-out
- `useReducedMotion()` → skip directly to final value

---

## 3. FEATURED TRIPS SECTION

```
Background:  #FFFFFF
Padding:     var(--section-padding-y) var(--section-padding-x)
Grid:        3 columns desktop | 2 columns tablet | 1 column mobile
Gap:         32px
Max items:   6 (paginated from Firebase, limit: 6)
```

### Section Header

```
Eyebrow:   Section label (MASTER spec — cyan)
Heading:   "Curated Journeys" — Josefin Sans var(--text-h2), weight 700, #221E2A
Subhead:   DM Sans var(--text-large), color #4a5568, max-width: 52ch, margin: 0 auto
Alignment: center
```

### Card Animation (scroll-triggered)

```
Initial:  opacity: 0, translateY(20px)
Final:    opacity: 1, translateY(0)
Stagger:  0.08s per card
Duration: 600ms
Ease:     var(--ease-out)
```

### Section Footer

```
"View All Journeys" teal button, centered, margin-top: 48px
```

---

## 4. ABOUT SECTION

```
Background:  #221E2A + grain overlay
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      2-column split (desktop): 50% image | 50% content
             Stacked (mobile): image top, content bottom
```

### About Content Block

```
Eyebrow:    Section label spec (MASTER) — cyan
Heading:    Josefin Sans var(--text-h2), color: #FFFFFF
Pull quote: Cormorant Garamond italic, clamp(20px, 2.5vw, 28px)
            color: rgba(255,255,255,0.75), margin: 24px 0
Body:       DM Sans 16px, color: rgba(255,255,255,0.68), line-height: 1.75
            max-width: 52ch
CTA:        Ghost btn (MASTER spec)
```

### Image Block

```
Aspect ratio: 3/4
Border:       none
Subtle rotate: rotate(-1deg) — slight tilt for editorial feel
Hover:        rotate(0deg), transition: 600ms
```

---

## 5. RETREATS SECTION

```
Background:  #E9F5F7 (ice)
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      1 featured (full-width or 60/40 split) + 2 small below
```

### Featured Retreat Card

```
Layout:  60% image left, 40% content right (desktop)
         Stacked on tablet/mobile
Image:   aspect-ratio 3/2, no radius
Badge:   Lime badge (MASTER spec)
Content: Eyebrow, heading (Josefin Sans h3), body (DM Sans), CTA (teal btn)
Background of content side: #FFFFFF
```

---

## 6. SERVICES SECTION

```
Background:  #221E2A + grain overlay
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      4 service tiles in a row (desktop), 2×2 (tablet), 1col (mobile)
```

### Service Tile

```
Background:  rgba(255,255,255,0.04)
Border:      1px solid rgba(255,255,255,0.08)
Padding:     32px
Border-radius: 0

Icon:     Lucide icon, 32px, color: #0ED2E9
Title:    Josefin Sans 18px 600, color: #FFFFFF, margin-top: 20px
Body:     DM Sans 14px, color: rgba(255,255,255,0.65), margin-top: 12px

Hover:
  border-color: rgba(193,234,0,0.25)
  background: rgba(255,255,255,0.07)
  transition: all 350ms
```

---

## 7. BLOG SECTION

```
Background:  #FFFFFF
Padding:     var(--section-padding-y) var(--section-padding-x)
Grid:        3 columns desktop | 2 tablet | 1 mobile
Max items:   3 (latest posts)
```

> Use standard Blog Card spec from MASTER.md.

---

## 8. AUDIENCE SECTION

```
Layout:   Split — left #285056 teal | right #FFFFFF white
Padding:  var(--section-padding-y) var(--section-padding-x) on each side
Each side: Eyebrow + heading + 3 bullet points + CTA
```

---

## 9. NEWSLETTER SECTION

```
Background:  #221E2A + grain overlay
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      Centered, max-width: 640px
```

### Newsletter UI

```
Heading:   Josefin Sans var(--text-h2), white, text-wrap: balance, text-align: center
Subhead:   DM Sans 16px, rgba(255,255,255,0.65), center, margin-top: 16px
Form:      Flex row (desktop) | stack (mobile)
Input:     DM Sans 15px, padding: 16px 20px, border: 1px solid rgba(255,255,255,0.2)
           background: rgba(255,255,255,0.06), color: white, radius: 0
           focus: border-color: #C1EA00
Submit:    Lime btn (MASTER spec), height: match input
```

---

## Page-Level Performance Rules

- Hero image: `next/image` with `priority`, `fill`, `quality={90}`, `sizes="100vw"`
- All section images: `next/image`, `placeholder="blur"`, `sizes` prop set per breakpoint
- Skeleton loaders for: Featured Trips cards, Blog cards (Firebase async content)
- Font loading: `next/font` in root layout — no FOUT
- Body: `overflow-x: hidden`
- `html`: `scroll-behavior: smooth`
