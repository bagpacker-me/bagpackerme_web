# Design System Page Override — Blog

> **LOGIC:** Rules here override `MASTER.md` where they conflict.
> For anything not mentioned, fall back to `MASTER.md`.

**Page:** Blog (`/blog`)
**Role:** Editorial hub — authority building, SEO, and brand storytelling
**Density:** Editorial — magazine-style, generous whitespace and typography

---

## Section Order & Rhythm

```
1.  PAGE HERO     → dark (#221E2A) — compact (40vh)
2.  FEATURED POST → white (#FFFFFF) — full-width prominent
3.  MAIN GRID     → surface-light (#F7F9FA) + teal sidebar
4.  NEWSLETTER    → dark (#221E2A) + grain
5.  FOOTER        → #1a1620
```

---

## 1. PAGE HERO

```
Height:      40vh (min: 320px), max: 500px
Background:  #221E2A + grain overlay
Layout:      Centered

Eyebrow:     Section label (MASTER spec)
Heading:     "Stories from the Road" — Josefin Sans var(--text-h1), white
Subhead:     Cormorant Garamond italic, clamp(18px,2vw,24px)
             color: rgba(255,255,255,0.72), margin-top: 16px
```

---

## 2. FEATURED POST

```
Background:  #FFFFFF
Padding:     clamp(64px,8vw,96px) var(--section-padding-x)
Layout:      Full-width feature — 60/40 split desktop | stacked mobile
```

### Featured Post Layout

```
Left (60%):
  Image:      aspect-ratio 16/9 (or 3/2 for larger), no radius
              .img-zoom hover
              Category badge: cyan variant, top-left absolute

Right (40%):
  Category:   Josefin Sans 11px 700, tracking-widest, #0ED2E9, ALL CAPS
              margin-bottom: 12px
  Heading:    Josefin Sans var(--text-h2), #221E2A, weight 700
              line-height: 1.15, text-wrap: balance
              margin-bottom: 16px
  Pull quote: Cormorant Garamond italic, 20px, #4a5568
              border-left: 3px solid #C1EA00, padding-left: 20px
              margin: 24px 0
  Excerpt:    DM Sans 16px, #4a5568, line-height: 1.75
              max-width: var(--prose-width), margin-bottom: 28px
  Meta row:   DM Sans 12px #718096 — Author Avatar + Name + Date + Read Time
  CTA:        Teal btn "Read Full Story"
```

---

## 3. MAIN GRID + SIDEBAR

```
Background:  #F7F9FA
Padding:     var(--section-padding-y) var(--section-padding-x)
Layout:      2/3 main content | 1/3 sidebar (desktop) | stacked (mobile below 1024px)
Gap:         48px
```

### Main Blog Grid

```
Grid:    2 columns desktop within main area
         1 column tablet/mobile
Gap:     32px
```

> Use standard Blog Card component from `MASTER.md` Section 6.7.

### Blog Card Typography (editorial upgrade)

```
Title:    Josefin Sans 20px 600 (vs 18px base), margin-bottom: 12px
Excerpt:  DM Sans 15px, line-height: 1.75 (vs 14px base), -webkit-line-clamp: 3
Date:     show full date format "March 28, 2025" not relative time
```

### Pagination

```
Style:    numbered (1, 2, 3 … next)
Font:     Josefin Sans 13px 600
Active:   background #285056, color white
Others:   border: 1px solid rgba(34,30,42,0.12), bg transparent, color #4a5568
Hover:    border-color #285056, color #285056
Radius:   0 (sharp)
Padding:  10px 16px
```

---

## 4. SIDEBAR (desktop only — hidden below 1024px)

```
Width:      full 1/3 column
Position:   sticky top: calc(72px + 52px + 20px) (nav + anchor nav offset)
```

### Sidebar: Category Filter

```
Heading:    Josefin Sans 12px 700 tracking-widest UPPERCASE, #221E2A
            margin-bottom: 16px, padding-bottom: 12px
            border-bottom: 1px solid rgba(34,30,42,0.1)

Category list items:
  Layout:   flex space-between
  Label:    DM Sans 14px, #4a5568
  Count:    DM Sans 12px, #C1EA00, background: rgba(193,234,0,0.1)
            padding: 1px 8px
  Active:   color: #285056, font-weight: 600
  Hover:    color: #285056
  Padding:  10px 0
  Border-bottom: 1px solid rgba(34,30,42,0.06)
```

### Sidebar: Newsletter CTA

```
Margin-top:  32px
Background:  #221E2A
Padding:     28px
Border-radius: 0

Heading:  Josefin Sans 18px 600, white
Body:     DM Sans 13px, rgba(255,255,255,0.65), margin-top: 8px, margin-bottom: 20px

Input:    DM Sans 14px, white, bg: rgba(255,255,255,0.08)
          border: 1px solid rgba(255,255,255,0.15)
          padding: 12px 16px, radius: 0, width: 100%
          focus: border-color: #C1EA00

Submit:   Lime btn (full-width), padding: 12px 28px, margin-top: 12px, font-size: 12px
```

### Sidebar: Popular Posts

```
Margin-top:  32px
Heading:     Josefin Sans 12px 700 tracking-widest UPPERCASE, #221E2A
             margin-bottom: 16px

Post items (max 4):
  Layout:    flex, gap: 12px, padding: 12px 0
  Image:     48×48px, object-fit: cover, flex-shrink: 0
  Title:     DM Sans 13px 500, #221E2A, line-clamp: 2
  Date:      DM Sans 11px, #718096, margin-top: 4px
  Hover:     title color → #285056
  Border-bottom: 1px solid rgba(34,30,42,0.06) (except last)
```

---

## 5. NEWSLETTER SECTION (full-width)

> Use Newsletter section from `home.md` Page Override — identical spec.

---

## Article Page (`/blog/[slug]`)

> When building a blog article page, this sub-spec applies.

```
Max-width of article body:  var(--prose-width) (68ch), centered
```

### Article Typography

```
Article h1:    Josefin Sans var(--text-h1), #221E2A, weight 700, text-wrap: balance
Article lead:  DM Sans var(--text-large), #4a5568, line-height: 1.75, margin: 24px 0 40px
Article h2:    Josefin Sans var(--text-h3), #221E2A, weight 700, margin: 48px 0 20px
Article h3:    Josefin Sans var(--text-h4), #221E2A, weight 600, margin: 32px 0 16px
Article body:  DM Sans 17px, #4a5568, line-height: 1.85 (editorial — generous)
               paragraph-gap: 28px
Pull quote:    Cormorant Garamond italic, clamp(22px,3vw,30px), #221E2A
               border-left: 4px solid #C1EA00, padding: 4px 0 4px 28px
               margin: 40px 0
Inline images: full-width within prose, no radius, caption below in DM Sans 12px #718096
Code blocks:   bg: #F7F9FA, border: 1px solid rgba(34,30,42,0.08), padding: 16px, radius: 0
```

### Article Header

```
Hero image: full-bleed (before container), aspect-ratio 21/9, overlay gradient at bottom
Below hero:
  Category badge (lime)
  Eyebrow / category
  H1 title
  Author row: avatar + name + date + read time
  Separator: 1px, margin: 32px 0
```

### Article Sidebar (sticky, desktop)

```
TOC (Table of Contents):
  Heading: Josefin Sans 11px 700 tracking-widest, #221E2A, UPPERCASE
  Items: DM Sans 13px, #718096
  Active: color #285056, border-left: 2px #285056, padding-left: 8px
  Hover: color #285056
```

---

## SEO Requirements (Blog Pages)

```
- meta title: "[Post Title] | BagPackerMe Blog"
- meta description: first 155 chars of excerpt
- og:image: hero image URL
- Article schema (JSON-LD): Article type, author, datePublished, image
- Canonical URL on every post
- Breadcrumb schema: Home > Blog > [Post Title]
```
