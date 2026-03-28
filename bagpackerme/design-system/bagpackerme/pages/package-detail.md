# Design System Page Override — Single Package Detail

> **LOGIC:** Rules here override `MASTER.md` where they conflict.
> For anything not mentioned, fall back to `MASTER.md`.

**Page:** Package Detail (`/packages/[slug]`)
**Role:** Convert a browser into an inquirer — immersive, rich, trustworthy
**Density:** Rich — high information density but visually breathing

---

## Section Order & Rhythm

```
1.  HERO              → dark (100svh, cinematic full-bleed)
2.  ANCHOR NAV        → white/sticky (below hero, appears after scroll)
3.  OVERVIEW          → white (#FFFFFF)
4.  HIGHLIGHTS        → ice (#E9F5F7)
5.  ITINERARY         → dark (#221E2A) + grain
6.  GALLERY           → white (#FFFFFF)
7.  INCLUSIONS        → ice (#E9F5F7)
8.  INQUIRY FORM      → dark (#221E2A) + full-bleed image + grain
9.  SIMILAR PACKAGES  → white (#FFFFFF)
10. FOOTER            → #1a1620
```

---

## 1. HERO

```
Height:      100svh (min: 600px)
Background:  Hero image (package primary photo) + overlay + grain
Overlay:     linear-gradient(to bottom,
               rgba(34,30,42,0.30) 0%,
               rgba(34,30,42,0.50) 60%,
               rgba(34,30,42,0.85) 100%)
```

### Hero Content (bottom-anchored)

```
Position:    absolute, bottom: 80px, left: var(--section-padding-x)
Max-width:   700px

Category badge: Trip card badge spec from MASTER (lime)
Eyebrow:        DM Sans 13px, rgba(255,255,255,0.65), margin-bottom: 12px
Heading:        Josefin Sans var(--text-display), white, weight 700
                tracking: -0.02em, line-height: 1.0
Tagline:        Cormorant Garamond italic, clamp(18px,2vw,26px), rgba(255,255,255,0.78)
                margin-top: 16px
Meta row:       DM Sans 14px, rgba(255,255,255,0.65)
                Icons: Lucide (Clock, Users, MapPin) — 16px, cyan #0ED2E9
                Gap: 24px between meta items, margin-top: 20px
CTA:            Lime btn "Enquire Now" + Ghost btn "View Itinerary"
                margin-top: 32px, gap: 16px
```

### Sticky Sidebar (desktop only)

```
Position:    sticky, top: calc(72px + 20px)
Width:       320px
Background:  #FFFFFF
Border:      1px solid rgba(34,30,42,0.08)
Padding:     32px
Z-index:     40

Content:
  Price display: Josefin Sans 32px 700, #221E2A
  "per person" label: DM Sans 12px #718096
  Duration/group meta: DM Sans 13px #4a5568
  Separator: 1px #E9F5F7, margin: 24px 0
  "Enquire Now" lime btn (full width)
  "Call Us" ghost btn (full width, teal variant)
  Gap between: 12px
  Trust badges below: icons + text (DM Sans 12px, #718096)
    - ✓ Free Cancellation
    - ✓ Instant Confirmation
    - ✓ 24/7 Support
```

---

## 2. ANCHOR NAV

```
Appears:     after hero section leaves viewport
Background:  #FFFFFF
Border-bottom: 1px solid rgba(34,30,42,0.08)
Height:      52px
Top:         72px (below main navbar)
Z-index:     40

Links:       DM Sans 13px 500, #4a5568
             Active: color #285056, border-bottom: 2px solid #285056
             Hover: color #285056
             Padding: 16px 20px
             Anchors: #overview, #highlights, #itinerary, #gallery, #inclusions, #book

Mobile:      Horizontal scroll, same hide-scrollbar treatment as filter bar
```

---

## 3. OVERVIEW SECTION

```
Background:  #FFFFFF
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      2-column (content 65%, sidebar 35%) desktop | stacked mobile
```

### Overview Content

```
Eyebrow:   Section label (MASTER spec)
Heading:   "About This Journey" - Josefin Sans var(--text-h2), #221E2A
Body:      DM Sans 16px, #4a5568, line-height: 1.8
           max-width: var(--prose-width)
           paragraph-gap: 20px

Highlights strip below body:
  3 icon+text items in a row
  Icon: Lucide 24px, #285056
  Label: Josefin Sans 11px 700 tracking-widest ALL-CAPS, #0ED2E9
  Value: DM Sans 16px 600, #221E2A
```

---

## 4. HIGHLIGHTS SECTION

```
Background:  #E9F5F7 (ice)
Padding:     var(--section-padding-y) var(--section-padding-x)
Grid:        3 columns desktop | 2 tablet | 1 mobile
Gap:         24px
```

### Highlight Card

```
Background:  #FFFFFF
Border:      1px solid rgba(34,30,42,0.06)
Padding:     28px
Border-radius: 0

Number:   Josefin Sans clamp(48px,5vw,64px) 700, color: rgba(40,80,86,0.12)
          position: absolute top-16px right-20px (decorative)
Icon:     Lucide 24px, #285056, margin-bottom: 16px
Title:    Josefin Sans 17px 600, #221E2A, margin-bottom: 8px
Body:     DM Sans 14px, #718096, line-height: 1.6
```

---

## 5. ITINERARY SECTION

> Use full Itinerary Timeline component from `MASTER.md` Section 6.8.

```
id="itinerary"
Background:  #221E2A + grain overlay
Padding:     var(--section-padding-y) var(--section-padding-x)
```

### Section Header

```
Eyebrow:   Section label (white variant: line #FFFFFF, text #0ED2E9)
Heading:   "Day by Day" — Josefin Sans var(--text-h2), white
```

### Day Item Animation

```
Scroll trigger: when item enters viewport (IntersectionObserver / Framer Motion whileInView)
Odd days:   slide from right (-60px) + fade in
Even days:  slide from left (+60px) + fade in
Delay:      0.1s stagger between days
Duration:   700ms, ease-out
Reduced-motion: skip animation
```

---

## 6. GALLERY SECTION

```
id="gallery"
Background:  #FFFFFF
Padding:     var(--section-padding-y) var(--section-padding-x)
```

### Masonry Grid

```
Columns:     3 (desktop) | 2 (tablet) | 1 (mobile)
Gap:         8px
Images:      no border-radius, overflow hidden
             .img-zoom hover effect (MASTER spec)
             Cursor: crosshair (signals lightbox)

Lightbox:
  z-index:   100
  Background: rgba(34,30,42,0.96)
  Controls:  prev/next arrows (Lucide ChevronLeft/Right, 32px white)
  Close:     X icon top-right, 24px white
  Counter:   DM Sans 12px white, centered bottom ("3 / 12")
  Image:     max 90vh × 90vw, object-fit: contain
  Keyboard:  ArrowLeft, ArrowRight, Escape to close
```

---

## 7. INCLUSIONS SECTION

```
id="inclusions"
Background:  #E9F5F7 (ice)
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      2-column (Included | Excluded) desktop | stacked mobile
```

### Inclusion/Exclusion Lists

```
Heading:  Josefin Sans 18px 600, #221E2A
Items:    DM Sans 15px, #4a5568, line-height: 1.6
          padding: 12px 0, border-bottom: 1px solid rgba(34,30,42,0.06)

Included icon:  Lucide Check, 18px, #22c55e (success green)
Excluded icon:  Lucide X, 18px, #ef4444 (error red)
```

---

## 8. INQUIRY FORM SECTION

```
id="book"
Background:  full-bleed image (secondary package photo) + overlay + grain
Overlay:     rgba(34,30,42,0.80)
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      content-left (50%) + form-right (50%) max-width container
             Mobile: stacked — content above, form below
```

### Form Card

```
Background:  #FFFFFF
Padding:     40px
Border-radius: 0
Shadow:      var(--shadow-xl)
Max-width:   480px
```

### Form Fields

```
All inputs:  MASTER spec
             border-radius: 0
             font: DM Sans 15px
             label: Josefin Sans 11px 700 tracking-widest UPPERCASE, #221E2A, margin-bottom: 6px
             focus: border-color: #285056, box-shadow: 0 0 0 3px rgba(40,80,86,0.12)

Fields:
  - Full Name (text)
  - Email (email)
  - Phone with country code (tel)
  - Travel Date (date)
  - Group Size (number, min: 1, max: 30)
  - Special Requests (textarea, min-height: 100px)

Submit:   Lime btn (full-width), text "Send My Enquiry"
Privacy:  DM Sans 11px #718096, center, margin-top: 16px, with link to privacy policy
```

### Left Content

```
Eyebrow:   Section label (white variant)
Heading:   "Ready to Journey?" — Josefin Sans var(--text-h2), white
Body:      DM Sans 16px, rgba(255,255,255,0.72), max-width: 40ch, margin-top: 16px
Trust:     3 trust icons (see sidebar trust badges), white + dim text, margin-top: 32px
```

---

## 9. SIMILAR PACKAGES

```
Background:  #FFFFFF
Padding:     var(--section-padding-y) var(--section-padding-x)
Grid:        3 columns desktop | 2 tablet | 1 mobile
Max items:   3 (exclude current package by ID)
Firebase:    query same category, limit: 4, filter out current ID client-side
```

---

## Mobile-Specific Rules

```
Sticky:  Bottom bar (position: fixed, bottom: 0, height: 64px)
         Background: #FFFFFF, border-top: 1px solid rgba(34,30,42,0.1)
         Content: Price on left + "Enquire Now" lime btn on right
         Z-index: 999

Hide:    Desktop sticky sidebar on mobile (display: none below 1024px)
Show:    Mobile sticky bottom bar only on mobile/tablet
```

---

## Performance Rules

- Hero image: `priority`, `fill`, `quality={90}`, `sizes="100vw"`
- Gallery images: lazy load, `placeholder="blur"`, `sizes="(max-width: 768px) 100vw, 33vw"`
- Itinerary images: `placeholder="blur"`, `sizes="200px"`
- Similar packages: defer fetch client-side after main content loads
