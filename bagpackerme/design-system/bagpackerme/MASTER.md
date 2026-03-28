# BAGPACKERME — Design System Master File
> **GLOBAL SOURCE OF TRUTH** — When building any page, first check `design-system/bagpackerme/pages/[page-name].md`.
> If that page file exists, its rules **override** this MASTER where they conflict.
> If no page file exists, follow this MASTER exclusively.

**Project:** BAGPACKERME — Experiential Journeys Through India
**Brand Voice:** Where National Geographic editorial meets boutique travel. Cinematic, trustworthy, quietly premium. NOT a generic travel agency.
**Reference Aesthetic:** Airbnb Luxe × fine art magazine
**Stack:** Next.js 14 (App Router) · Tailwind CSS · Framer Motion
**Generated / Locked:** 2026-03-28

---

## 1. COLOR TOKEN SYSTEM

> ⚠️ These are LOCKED. No deviation without updating this file.

### CSS Custom Properties

```css
:root {
  /* === PRIMARY PALETTE === */
  --color-primary:       #285056;            /* Teal — trust, depth, nature */
  --color-primary-dark:  #1e3d42;            /* Teal dark — hover state */
  --color-primary-light: #3a6e76;            /* Teal light variant */

  /* === ACCENT PALETTE === */
  --color-accent:        #C1EA00;            /* Lime — action, energy, CTA only */
  --color-accent-hover:  #afd100;            /* Lime hover state */
  --color-accent-glow:   rgba(193,234,0,0.2);/* Lime glow for box-shadows */

  /* === HIGHLIGHT === */
  --color-highlight:     #0ED2E9;            /* Cyan — labels, links, icon accents */
  --color-highlight-dim: rgba(14,210,233,0.15); /* Cyan subtle bg */

  /* === NEUTRAL SURFACES === */
  --color-surface-lightest: #FFFFFF;
  --color-surface-light:    #F7F9FA;
  --color-surface-mid:      #E9F5F7;         /* Ice — section backgrounds */
  --color-surface-dark:     #221E2A;         /* Void — dark sections */
  --color-surface-darker:   #1a1620;         /* Even deeper dark backgrounds */

  /* === TEXT === */
  --color-text-primary:     #221E2A;         /* Body text on light backgrounds */
  --color-text-secondary:   #4a5568;         /* Subtitles, captions */
  --color-text-muted:       #718096;         /* Meta text, placeholders */
  --color-text-inverse:     #FFFFFF;         /* Text on dark backgrounds */
  --color-text-inverse-dim: rgba(255,255,255,0.68); /* Dimmed text on dark */

  /* === SEMANTIC === */
  --color-success: #22c55e;
  --color-error:   #ef4444;
  --color-warning: #f59e0b;

  /* === BORDERS === */
  --color-border-light:  rgba(34,30,42,0.08);
  --color-border-mid:    rgba(34,30,42,0.14);
  --color-border-dark:   rgba(255,255,255,0.10);
  --color-border-accent: #C1EA00;
}
```

### Semantic Color Usage Rules

| Color | Hex | ONLY Use For |
|-------|-----|-------------|
| Lime `--color-accent` | `#C1EA00` | CTAs, key highlights — NOT decorative |
| Cyan `--color-highlight` | `#0ED2E9` | Section labels, links, icon accents ONLY |
| Teal `--color-primary` | `#285056` | Primary actions, teal buttons, borders on light |
| Void `--color-surface-dark` | `#221E2A` | Dark section backgrounds |
| Ice `--color-surface-mid` | `#E9F5F7` | Light alternate section backgrounds |

### Contrast Compliance (WCAG AA — 4.5:1 minimum)

| Foreground | Background | Ratio | Status |
|-----------|-----------|-------|--------|
| `#FFFFFF` | `#285056` teal | ✅ | PASSES |
| `#221E2A` | `#C1EA00` lime | ✅ | PASSES |
| `#0ED2E9` | `#221E2A` void | ⚠️ | Verify — use at ≥14px only |
| `#FFFFFF` | `#221E2A` void | ✅ | PASSES |
| `#F1F5F9` | `#221E2A` void | ✅ | PASSES |

---

## 2. TYPOGRAPHY SYSTEM

### Font Families

```css
:root {
  --font-display: 'Josefin Sans', 'Raleway', sans-serif;     /* Headers, logo, nav, all-caps labels */
  --font-body:    'DM Sans', sans-serif;                      /* Body text, descriptions, UI copy */
  --font-accent:  'Cormorant Garamond', Georgia, serif;       /* Pull quotes, taglines, script labels ONLY */
}
```

### Next.js Font Loading (next/font — preferred over @import)

```tsx
import { Josefin_Sans, DM_Sans, Cormorant_Garamond } from 'next/font/google'

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-accent',
  display: 'swap',
})
```

### Font Role Rules

| Font | Variable | Use For | Never Use For |
|------|----------|---------|---------------|
| Josefin Sans | `--font-display` | All headings, logo, nav, badges, section labels, buttons | Long body text |
| DM Sans | `--font-body` | Body paragraphs, card descriptions, UI copy, inputs | Display headlines |
| Cormorant Garamond | `--font-accent` | Pull quotes, taglines, hero subheadings (italic), decorative script | UI elements, buttons, body |

### Type Scale (Fluid / Clamp-based)

```css
:root {
  --text-hero:    clamp(52px, 8.5vw, 104px); /* Hero main headline */
  --text-display: clamp(40px, 6vw, 80px);    /* Page titles, section heroes */
  --text-h1:      clamp(32px, 4.5vw, 64px);  /* H1 */
  --text-h2:      clamp(26px, 3.5vw, 48px);  /* H2 */
  --text-h3:      clamp(20px, 2.5vw, 32px);  /* H3 */
  --text-h4:      clamp(16px, 2vw, 24px);    /* H4 */
  --text-large:   clamp(17px, 1.5vw, 20px);  /* Lead paragraphs */
  --text-base:    16px;                       /* Body */
  --text-small:   14px;                       /* Captions, meta */
  --text-xs:      12px;                       /* Badges, labels */
  --text-xxs:     11px;                       /* Section labels, spaced caps */
}
```

### Letter Spacing

```css
:root {
  --tracking-tightest: -0.03em; /* Large display headlines (hero) */
  --tracking-tight:    -0.01em; /* H1, H2 */
  --tracking-normal:    0em;
  --tracking-wide:      0.04em; /* Body, cards */
  --tracking-wider:     0.08em; /* Nav links */
  --tracking-widest:    0.18em; /* Section labels, badges (ALL CAPS) */
  --tracking-extreme:   0.25em; /* Logo wordmark */
}
```

### Line Heights

```css
:root {
  --leading-tightest: 0.95; /* Hero headlines */
  --leading-tight:    1.1;  /* Display headings */
  --leading-snug:     1.25; /* H2–H4 */
  --leading-normal:   1.5;  /* Body text */
  --leading-relaxed:  1.7;  /* Long-form paragraphs */
  --leading-loose:    1.9;  /* Captions, meta */
}
```

### Font Weights

```css
:root {
  --weight-light:    300;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
}
```

### Tailwind Config — fontFamily Block

```ts
// tailwind.config.ts
fontFamily: {
  display: ['var(--font-display)', 'Josefin Sans', 'Raleway', 'sans-serif'],
  body:    ['var(--font-body)', 'DM Sans', 'sans-serif'],
  sans:    ['var(--font-body)', 'DM Sans', 'sans-serif'],
  accent:  ['var(--font-accent)', 'Cormorant Garamond', 'Georgia', 'serif'],
}
```

---

## 3. SPACING SYSTEM (8pt Grid — NEVER BREAK IT)

```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;
  --space-24:  96px;
  --space-32:  128px;
  --space-40:  160px;

  /* Section vertical padding (fluid) */
  --section-padding-y: clamp(80px, 10vw, 140px);
  --section-padding-x: clamp(20px, 5vw, 80px);

  /* Container widths */
  --container-sm:  720px;
  --container-md:  960px;
  --container-lg:  1200px;
  --container-xl:  1400px;

  /* Reading comfort */
  --prose-width: 68ch;
}
```

### Component Spacing Rules

| Element | Padding |
|---------|---------|
| Button (sm) | `14px 28px` |
| Button (md) | `16px 36px` |
| Button (lg) | `20px 48px` |
| Card inner (sm) | `24px` |
| Card inner (md) | `32px` |
| Card inner (lg) | `40px` |
| Input | `12px 16px` |
| Nav link | `8px 16px` |
| Badge | `4px 12px` |
| Section label → heading gap | `16px` |
| Heading → body gap | `24px` |
| Body paragraph gap | `20px` |

---

## 4. SHAPE & MOTION TOKENS

### Border Radius (Intentionally restrained — sharp = premium)

```css
:root {
  --radius-none: 0px;    /* Primary: cards, buttons — sharp edges */
  --radius-xs:   2px;    /* Subtle rounding on inputs */
  --radius-sm:   4px;    /* Small UI elements */
  --radius-md:   8px;    /* Modals, dropdowns */
  --radius-lg:   16px;   /* Large cards when rounded style needed */
  --radius-full: 9999px; /* Pills, avatars */
}
```

### Shadows

```css
:root {
  --shadow-sm:         0 1px 3px rgba(34,30,42,0.08), 0 1px 2px rgba(34,30,42,0.06);
  --shadow-md:         0 4px 16px rgba(34,30,42,0.10), 0 2px 8px rgba(34,30,42,0.08);
  --shadow-lg:         0 12px 40px rgba(34,30,42,0.14), 0 4px 16px rgba(34,30,42,0.10);
  --shadow-xl:         0 24px 64px rgba(34,30,42,0.18), 0 8px 24px rgba(34,30,42,0.12);
  --shadow-card-hover: 0 20px 60px rgba(34,30,42,0.22);
  --shadow-teal:       0 8px 32px rgba(40,80,86,0.28);
  --shadow-lime:       0 8px 32px rgba(193,234,0,0.22);
  --shadow-inset:      inset 0 1px 0 rgba(255,255,255,0.06);
}
```

### Motion Easing

```css
:root {
  --ease-default: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in:      cubic-bezier(0.4, 0, 1, 1);
  --ease-out:     cubic-bezier(0, 0, 0.2, 1);
  --ease-inout:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-back:    cubic-bezier(0.68, -0.55, 0.27, 1.55);

  --duration-instant: 100ms;
  --duration-fast:    200ms;
  --duration-mid:     350ms;
  --duration-slow:    600ms;
  --duration-slower:  900ms;
}
```

### Animation Rules

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero headline words | slideUp + fadeIn, 0.1s stagger per word | Page load |
| Cards | fadeIn + translateY(20px→0), 0.08s stagger | Scroll into view |
| Page transitions | fade + translateY(10px), 300ms | Route change |
| Itinerary items | slide from left/right alternating | Scroll into view |
| Hover states | max 350ms, `--ease-default` | Mouse hover |

> ⚠️ All Framer Motion animations MUST be wrapped with `useReducedMotion()`. When reduced motion is preferred, show final state immediately.

---

## 5. LAYOUT SYSTEM

### Grid

| Viewport | Columns | Gutters | Outer Margin |
|----------|---------|---------|--------------|
| Desktop 1280px+ | 12-col | 24px | 80px |
| Laptop 1024–1279px | 12-col | 20px | 60px |
| Tablet 768–1023px | 8-col | 16px | 40px |
| Mobile 375–767px | 4-col | 12px | 20px |

### Section Rhythm Rules (MANDATORY for every section)

- ✅ Minimum `padding-top`: `80px` mobile → `120px` desktop (use `--section-padding-y`)
- ✅ Minimum `padding-bottom`: `80px` mobile → `120px` desktop
- ✅ **Section label (eyebrow)** above every major heading: `11px`, `tracking-widest`, UPPERCASE, `#0ED2E9` cyan, with 32px line before it
- ✅ Max body text width: `68ch` (`--prose-width`) — never full container width
- ✅ Headings and body text must never touch container edge
- ✅ Dark sections (`--color-surface-dark`) must have grain texture overlay
- ✅ **Section alternation pattern**: dark → light → dark → ice → dark (never two same-color sections adjacent unless explicitly planned)

### Z-Index Hierarchy

| Layer | Z-index | Elements |
|-------|---------|----------|
| Base | `0` | Normal content flow |
| Cards | `1` | Elevated cards |
| Sticky Elements | `40` | Sticky sidebar, anchored elements |
| Navigation | `50` | Navbar |
| Modals | `100` | Overlays, dialogs |
| Floating Buttons | `999` | WhatsApp float, scroll-to-top |

---

## 6. COMPONENT SPECIFICATIONS

### 6.1 Primary CTA Button (Lime)

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #C1EA00;
  color: #221E2A;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 16px 40px;
  border-radius: 0;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 350ms var(--ease-default);
}

.btn-primary::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: #285056;
  transform: scaleX(0);
  transition: transform 350ms var(--ease-out);
}

.btn-primary:hover {
  background: #afd100;
  transform: translateY(-3px);
  box-shadow: var(--shadow-lime);
}

.btn-primary:hover::after {
  transform: scaleX(1);
}

.btn-primary:active {
  transform: translateY(-1px);
}

.btn-primary:focus-visible {
  outline: 2px solid #C1EA00;
  outline-offset: 2px;
}
```

### 6.2 Ghost Button (for dark backgrounds)

```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #FFFFFF;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 15px 39px;
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 0;
  cursor: pointer;
  transition: all 350ms var(--ease-default);
}

.btn-ghost:hover {
  border-color: #FFFFFF;
  background: rgba(255,255,255,0.07);
  transform: translateY(-2px);
}

.btn-ghost:focus-visible {
  outline: 2px solid #C1EA00;
  outline-offset: 2px;
}
```

### 6.3 Teal Button

```css
.btn-teal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #285056;
  color: #FFFFFF;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 16px 40px;
  border-radius: 0;
  border: none;
  cursor: pointer;
  transition: all 350ms var(--ease-default);
}

.btn-teal:hover {
  background: #1e3d42;
  transform: translateY(-2px);
  box-shadow: var(--shadow-teal);
}

.btn-teal:focus-visible {
  outline: 2px solid #C1EA00;
  outline-offset: 2px;
}
```

### 6.4 Package / Trip Card

```css
/* Container */
.trip-card {
  border-radius: 0;
  overflow: hidden;
  background: #FFFFFF;
  position: relative;
  cursor: pointer;
  transition: all 600ms var(--ease-default);
}

/* Image wrapper */
.trip-card__image-wrap {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  position: relative;
}

/* Image */
.trip-card__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 700ms var(--ease-default);
}

/* Category badge */
.trip-card__badge {
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  padding: 5px 12px;
  background: #C1EA00;
  color: #221E2A;
  z-index: 1;
}

/* Hover overlay */
.trip-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(40, 80, 86, 0.82);
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: opacity 400ms var(--ease-default);
}

.trip-card__overlay-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: #FFFFFF;
}

/* Card body */
.trip-card__body {
  padding: 24px;
}

.trip-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: #221E2A;
  margin-bottom: 8px;
}

.trip-card__tagline {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: #718096;
  margin-bottom: 16px;
}

.trip-card__meta {
  font-family: var(--font-body);
  font-size: 13px;
  color: #285056;
}

.trip-card__separator {
  height: 1px;
  background: #E9F5F7;
  margin: 16px 0;
}

.trip-card__cta {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: #285056;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 200ms var(--ease-default);
}

/* Hover states */
.trip-card:hover img {
  transform: scale(1.06);
}

.trip-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-6px);
}

.trip-card:hover .trip-card__overlay {
  opacity: 1;
}

.trip-card:hover .trip-card__cta {
  color: #C1EA00;
}
```

### 6.5 Section Label (Eyebrow)

```css
.section-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #0ED2E9;
  margin-bottom: 16px;
}

.section-label::before {
  content: '';
  display: block;
  width: 32px;
  height: 1px;
  background: #0ED2E9;
  flex-shrink: 0;
}
```

### 6.6 Navbar

```css
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--section-padding-x);
  background: transparent;
  transition: background 400ms var(--ease-default),
              backdrop-filter 400ms var(--ease-default);
  z-index: 50;
}

.navbar.scrolled {
  background: rgba(34, 30, 42, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.navbar__link {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  padding: 8px 16px;
  position: relative;
  transition: color 200ms var(--ease-default);
}

.navbar__link:hover {
  color: #C1EA00;
}

.navbar__link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #C1EA00;
}

.navbar__cta {
  /* Lime btn variant, smaller */
  padding: 12px 28px;
  font-size: 12px;
}

/* Mobile */
@media (max-width: 767px) {
  .navbar { height: 60px; }
}
```

#### Mobile Menu

```css
.mobile-menu {
  position: fixed;
  inset: 0;
  background: #221E2A;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.mobile-menu__link {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 0.04em;
  /* Staggered: Framer Motion, 0.05s delay per item */
}
```

### 6.7 Blog Card

```css
.blog-card__image-wrap {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
}

.blog-card__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms var(--ease-default);
}

.blog-card:hover .blog-card__image-wrap img {
  transform: scale(1.04);
}

.blog-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  padding: 4px 10px;
  background: #0ED2E9;
  color: #221E2A;
}

.blog-card__body {
  padding: 20px 0;
}

.blog-card__date {
  font-family: var(--font-body);
  font-size: 11px;
  color: #718096;
  margin-bottom: 8px;
}

.blog-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: #221E2A;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.blog-card__excerpt {
  font-family: var(--font-body);
  font-size: 14px;
  color: #4a5568;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
}

.blog-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blog-card__read-time {
  font-family: var(--font-body);
  font-size: 12px;
  color: #718096;
}

.blog-card__read-link {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: #285056;
  letter-spacing: var(--tracking-wider);
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 200ms, gap 200ms;
}

.blog-card:hover .blog-card__read-link {
  color: #C1EA00;
  gap: 8px;
}
```

### 6.8 Itinerary Timeline

```css
/* Container */
.itinerary {
  background: #221E2A;
  padding: var(--section-padding-y) var(--section-padding-x);
  position: relative;
}

/* Grain overlay — required on dark sections */
.itinerary::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  pointer-events: none;
  z-index: 0;
}

/* Center line */
.itinerary__line {
  position: absolute;
  top: 0; bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  background: rgba(255,255,255,0.12);
}

/* Day node */
.itinerary__node {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 48px 1fr;
  align-items: center;
  margin-bottom: 80px;
  z-index: 1;
}

/* Circle */
.itinerary__circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #285056;
  background: #221E2A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 10px;
  color: #FFFFFF;
  margin: 0 auto;
}

/* Odd day: text right, image left */
.itinerary__node--odd .itinerary__text {
  text-align: right;
  padding-right: 60px;
  grid-column: 1;
}

.itinerary__node--odd .itinerary__image {
  grid-column: 3;
  grid-row: 1;
}

/* Even day: text left, image right (mirror) */
.itinerary__node--even .itinerary__text {
  text-align: left;
  padding-left: 60px;
  grid-column: 3;
  grid-row: 1;
}

.itinerary__node--even .itinerary__image {
  grid-column: 1;
  grid-row: 1;
}

/* Text content */
.itinerary__day-label {
  font-family: var(--font-body);
  font-size: 12px;
  color: #0ED2E9;
  margin-bottom: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.itinerary__location {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
}

.itinerary__description {
  font-family: var(--font-body);
  font-size: 15px;
  color: rgba(255,255,255,0.68);
  max-width: 380px;
  line-height: 1.7;
}

/* Image */
.itinerary__image img {
  width: 200px;
  height: 160px;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.15);
  transform: rotate(-1.5deg);
  transition: transform 400ms var(--ease-default);
}

.itinerary__image img:hover {
  transform: rotate(0deg);
}

/* Mobile: single column */
@media (max-width: 767px) {
  .itinerary__node {
    display: block;
    padding-left: 48px;
  }

  .itinerary__line {
    left: 24px;
    transform: none;
  }

  .itinerary__circle {
    position: absolute;
    left: 12px;
    margin: 0;
  }

  .itinerary__node--odd .itinerary__text,
  .itinerary__node--even .itinerary__text {
    text-align: left;
    padding: 0 0 16px 0;
  }

  .itinerary__image img {
    width: 100%;
    height: auto;
    transform: none;
  }
}
```

---

## 7. GLOBAL CSS PATTERNS

### Grain Overlay (Required on all dark sections)

```css
.grain-overlay {
  position: relative;
}

.grain-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  pointer-events: none;
  z-index: 0;
}
```

### Image Zoom (All card images)

```css
.img-zoom {
  overflow: hidden;
}

.img-zoom img {
  transition: transform 700ms var(--ease-default);
}

.img-zoom:hover img {
  transform: scale(1.06);
}
```

### Focus Ring (Global)

```css
*:focus-visible {
  outline: 2px solid #C1EA00;
  outline-offset: 2px;
}
```

### Prose Width Constraint

```css
.prose-content {
  max-width: var(--prose-width);
}
```

---

## 8. ANTI-PATTERNS — NEVER DO THESE

| ❌ Anti-Pattern | ✅ Correct Approach |
|-----------------|-------------------|
| Lime (#C1EA00) used decoratively | Lime ONLY for CTAs and key highlights |
| Cyan (#0ED2E9) on buttons | Cyan for labels, links, icon accents ONLY |
| Cormorant Garamond on UI elements | Cormorant ONLY for pull quotes, taglines |
| Rounded cards (border-radius > 8px) | Sharp edges (0px) for main cards/buttons |
| Two consecutive dark sections | Alternate section colors always |
| Dark section without grain overlay | Add `.grain-overlay` class |
| Body text wider than 68ch | Wrap in `.prose-content` max-width: 68ch |
| Emojis as icons | Use Lucide React SVG icons exclusively |
| Hover-only interactions on mobile | Provide tap equivalent for all hover states |
| Missing cursor: pointer on clickables | All interactive elements: cursor: pointer |
| Layout-shifting hover transforms | Use translateY only, not scale on container |
| Animations without reduced-motion check | Wrap all Framer Motion in useReducedMotion() |
| Images without alt text | All images: descriptive alt="" text required |
| Fast animations < 200ms on key elements | Min 350ms on primary interactions |

---

## 9. PRE-DELIVERY CHECKLIST

Run against EVERY component and page before considering it done.

### Accessibility (Priority 1 — CRITICAL)
- [ ] All text on dark backgrounds meets WCAG AA (4.5:1 contrast minimum)
- [ ] All interactive elements have visible focus rings (`outline: 2px solid #C1EA00; outline-offset: 2px`)
- [ ] All images have descriptive `alt` text (not empty, not "image")
- [ ] All form inputs have associated `<label>` elements
- [ ] Buttons have minimum 44×44px touch target
- [ ] No color-only meaning (badges have text, not just color)
- [ ] Keyboard navigation works for all interactive elements
- [ ] `prefers-reduced-motion`: all Framer Motion animations wrapped with `useReducedMotion()`

### Typography (Priority 2 — HIGH)
- [ ] One `<h1>` per page, logical H2→H3 hierarchy
- [ ] Body text never exceeds `68ch` width
- [ ] No orphans on hero headlines (`text-wrap: balance`)
- [ ] Font weights: 700 headers / 400 body / 500 labels
- [ ] Letter spacing on ALL-CAPS: minimum `0.1em`
- [ ] Line height on body text: minimum `1.6`
- [ ] Section label eyebrows present above all H2 headings

### Spacing (Priority 3 — HIGH)
- [ ] All spacing on 8pt grid (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80…)
- [ ] Section `padding-y` minimum 80px mobile, 120px desktop
- [ ] No content touching container edge (minimum 20px padding-x mobile)
- [ ] Card inner padding minimum 24px
- [ ] Grid item gap minimum 24px

### Layout (Priority 4 — HIGH)
- [ ] 12-column grid on desktop, 4-column on mobile
- [ ] No horizontal scroll (`overflow-x: hidden` on body)
- [ ] Sticky nav doesn't overlap content (`body: padding-top: 72px`)
- [ ] Z-index hierarchy respected
- [ ] Footer always at page bottom

### Visual Design (Priority 5)
- [ ] Grain overlay on ALL `#221E2A` sections
- [ ] All card images have `.img-zoom` hover behavior
- [ ] Section alternation pattern maintained
- [ ] Every section has an eyebrow label
- [ ] Lime used ONLY for CTAs

### Performance (Priority 6)
- [ ] All images use Next.js `<Image>` with `sizes` and `placeholder="blur"`
- [ ] Framer Motion uses lazy where appropriate
- [ ] No layout shift on font load (`font-display: swap`)
- [ ] Firebase queries paginated (max 12 per fetch)
- [ ] Skeleton loaders for ALL async content

### Motion (Priority 7)
- [ ] Hero headline: words slide up + fade in, 0.1s stagger
- [ ] Cards: fade + `translateY(20px→0)`, 0.08s stagger, on scroll
- [ ] Page transitions: fade + `translateY(10px)`, 300ms
- [ ] Hover states: max 350ms, `ease-default`
- [ ] Reduced-motion respected

### Mobile (Priority 8)
- [ ] Touch targets minimum 44×44px
- [ ] No hover-only interactions
- [ ] Bottom nav / floating CTA on mobile product pages
- [ ] Filter pills horizontally scrollable on mobile
- [ ] Timeline single-column on mobile
