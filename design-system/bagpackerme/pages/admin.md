# Design System Page Override — Admin Dashboard

> **LOGIC:** Rules here override `MASTER.md` where they conflict.
> For anything not mentioned, fall back to `MASTER.md`.
>
> ⚠️ The Admin Dashboard is a **functional tool**, not a marketing page.
> Apply MASTER tokens for color/typography, but override layout and density rules.
> NO: cinematic imagery, grain overlays, parallax, hero sections, Cormorant Garamond.
> YES: efficiency, clarity, data density, fast interactions.

**Page:** Admin (`/admin`, `/admin/*`)
**Role:** Internal tool — manage packages, bookings, blog, and enquiries
**Density:** Dense — data-oriented, maximize scannable information per viewport

---

## Layout Override

```
Grid:      NOT the 12-column marketing grid
Structure: Fixed sidebar layout

┌─────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Content  │
│                         │  Area     │
│                         │  (fluid)  │
└─────────────────────────────────────┘
```

```
Sidebar:
  Width:        240px
  Height:       100vh, sticky, overflow-y: auto
  Background:   #221E2A
  Border-right: 1px solid rgba(255,255,255,0.06)
  Top:          0 (admin has no public navbar)

Content Area:
  Margin-left:  240px
  Padding:      32px
  Background:   #F7F9FA
  Min-height:   100vh
```

### Mobile Admin Layout

```
Below 1024px:
  Sidebar: hidden by default, slide-in from left (drawer)
  Hamburger: top-left, 40×40 touch target
  Content: full width
  Top bar: 56px, white, shadow-sm
```

---

## 1. ADMIN SIDEBAR

```
Logo area:
  Height:     64px
  Padding:    0 24px
  Border-bottom: 1px solid rgba(255,255,255,0.06)
  Logo text: Josefin Sans 16px 700, #FFFFFF + teal accent

Nav sections:
  Section label: Josefin Sans 9px 700 tracking-widest UPPERCASE
                 color: rgba(255,255,255,0.35), padding: 24px 24px 8px

Nav items:
  Height:     44px (keyboard/touch accessible)
  Padding:    0 24px
  Font:       DM Sans 14px 400, rgba(255,255,255,0.65)
  Icon:       Lucide 16px, same color, margin-right: 10px, flex-shrink: 0
  Border-left: 2px solid transparent

  Hover:
    Background: rgba(255,255,255,0.04)
    Color: rgba(255,255,255,0.90)
    Border-left: 2px solid rgba(40,80,86,0.5)

  Active:
    Background: rgba(40,80,86,0.25)
    Color: #FFFFFF
    Border-left: 2px solid #285056
    Icon: color #0ED2E9

Badge (count):
  Background: #C1EA00
  Color: #221E2A
  Font: Josefin Sans 10px 700
  Padding: 1px 6px, border-radius: full
  Float: right

User area (bottom of sidebar):
  Border-top: 1px solid rgba(255,255,255,0.06)
  Padding: 16px 24px
  Avatar: 32px circle, bg #285056, initials in white
  Name: DM Sans 13px 500, white
  Email: DM Sans 11px, rgba(255,255,255,0.4)
  Logout link: DM Sans 12px, rgba(255,255,255,0.4), hover red
```

### Sidebar Nav Sections

```
OVERVIEW
  - Dashboard (LayoutDashboard)
  - Analytics (BarChart3)

CONTENT
  - Packages (MapPinned)
  - Blog Posts (FileText)
  - Gallery (Image)

BOOKINGS
  - Enquiries (MessageSquare) [badge: new count]
  - Bookings (Calendar)
  - Customers (Users)

SETTINGS
  - Site Settings (Settings)
  - Team (UserCheck)
```

---

## 2. TOP BAR

```
Height:      56px (inside content area, not sidebar)
Background:  #FFFFFF
Border-bottom: 1px solid rgba(34,30,42,0.08)
Padding:     0 32px
Display:     flex, space-between, align-center
Position:    sticky, top: 0, z-index: 40

Left:        Page title — Josefin Sans 18px 600, #221E2A
             Breadcrumb below: DM Sans 12px, #718096

Right:       Search bar (DM Sans 14px, 280px wide, radius-sm)
             Notification bell icon (Lucide Bell, 20px, #4a5568, badge if notifications)
             Avatar (same as sidebar user area, 32px)
```

---

## 3. CARD COMPONENTS (admin variants)

### Stat Card (Dashboard)

```
Background:  #FFFFFF
Border:      1px solid rgba(34,30,42,0.06)
Border-radius: 0
Padding:     24px
Shadow:      var(--shadow-sm)

Layout:      flex, space-between, align-start

Left:
  Label:   DM Sans 13px, #718096, margin-bottom: 8px
  Value:   Josefin Sans 28px 700, #221E2A
  Change:  DM Sans 12px — green if positive, red if negative
           Lucide TrendingUp/TrendingDown icon 14px

Right:
  Icon wrapper: 40×40px, bg: rgba(40,80,86,0.1), border-radius: 0
  Icon: Lucide, 20px, #285056

Hover: shadow-md (not translateY in admin — stable data context)
```

### Data Table

```
Container:
  Background:  #FFFFFF
  Border:      1px solid rgba(34,30,42,0.06)
  Border-radius: 0
  Shadow:      var(--shadow-sm)
  Overflow:    x-auto (horizontal scroll on small screens)

Table:
  Width: 100%
  Border-collapse: separate
  Border-spacing: 0

Header row:
  Background:   #F7F9FA
  Border-bottom: 1px solid rgba(34,30,42,0.08)  
  Height:       44px

  Th: DM Sans 11px 600, #718096, tracking: 0.06em, UPPERCASE
      padding: 0 16px, text-align: left

Data row:
  Height:        56px
  Border-bottom: 1px solid rgba(34,30,42,0.06)
  Transition:   background 150ms

  Td: DM Sans 14px, #221E2A, padding: 0 16px

  Hover:  background: rgba(40,80,86,0.03)

  Last row: no border-bottom

Checkbox column:
  Width: 48px, padding: 0 16px
  Checkbox: 16px, accent-color: #285056

Actions column:
  Width: 80px, text-align: right
  Icon buttons: 32×32, hover bg rgba(34,30,42,0.06), border-radius: var(--radius-sm)

Empty state:
  Padding: 64px 0, centered
  Icon: Lucide Inbox, 40px, #0ED2E9
  Text: DM Sans 14px, #718096
```

### Status Badge (table use)

```
Font:        Josefin Sans 10px 700 tracking-widest UPPERCASE
Padding:     4px 10px
Border-radius: 9999px (pill)
Min-width:   80px, text-align: center

Variants:
  new / pending:  bg rgba(14,210,233,0.12), color #0a9fb0      (cyan)
  confirmed:      bg rgba(34,197,94,0.12),  color #15803d      (green)
  in-progress:    bg rgba(245,158,11,0.12), color #b45309      (amber)
  completed:      bg rgba(40,80,86,0.12),   color #285056      (teal)
  cancelled:      bg rgba(239,68,68,0.12),  color #dc2626      (red)
```

---

## 4. FORM COMPONENTS (admin)

```
All forms: white card, border: 1px solid rgba(34,30,42,0.08), padding: 32px, radius: 0

Labels:       DM Sans 13px 500, #221E2A, margin-bottom: 6px
Inputs:       MASTER input spec, radius: var(--radius-xs)
              focus: border-color #285056, shadow 0 0 0 3px rgba(40,80,86,0.10)
Textarea:     min-height: 120px, resize: vertical
Select:       same style as input, Lucide ChevronDown icon
Helper text:  DM Sans 12px, #718096, margin-top: 4px
Error text:   DM Sans 12px, #ef4444, margin-top: 4px
              Input border-color: #ef4444, shadow: 0 0 0 3px rgba(239,68,68,0.08)

Rich text editor (blog body):
  Border: 1px solid rgba(34,30,42,0.12)
  Toolbar: bg #F7F9FA, border-bottom: 1px solid rgba(34,30,42,0.08)
  Padding: 16px

Button row:
  Position: flex, end-aligned, gap: 12px
  Save:     Teal btn (MASTER spec), padding: 12px 32px
  Cancel:   Ghost btn on light (border #d1d5db, color #4a5568), same padding
  Delete:   Only on edit pages — right-aligned, Lucide Trash2 icon, color #ef4444
            hover bg rgba(239,68,68,0.06)
```

---

## 5. PAGINATION (admin tables)

```
Layout:   flex, space-between, align-center
          Left: "Showing 1–12 of 48 results" (DM Sans 13px, #718096)
          Right: Prev / Next buttons + page numbers

Buttons:  DM Sans 13px, border: 1px solid rgba(34,30,42,0.12)
          Padding: 8px 14px, radius: var(--radius-xs)
          Hover: bg #F7F9FA
          Active page: bg #285056, color white, border-color #285056
          Disabled: opacity 0.4, cursor: not-allowed
```

---

## 6. QUICK ACTION PANEL

```
Placement: Top-right of dashboard
Background: #FFFFFF, border: 1px solid rgba(34,30,42,0.06), padding: 24px

Title: Josefin Sans 14px 600, #221E2A, margin-bottom: 16px

Action buttons (full-width):
  Height:    44px
  Font:      DM Sans 14px 400
  Icon:      Lucide 16px, #285056, margin-right: 10px
  Border:    1px solid rgba(34,30,42,0.08)
  Radius:    var(--radius-xs)
  Hover:     bg #F7F9FA

  Items:
    + New Package      (Lucide Plus)
    + New Blog Post    (Lucide FilePlus)
    View Enquiries     (Lucide MessageSquare)
    Export CSV         (Lucide Download)
```

---

## 7. NOTIFICATIONS / TOASTS

```
Position:    top-right, fixed, z-index: 999
Width:       360px
Padding:     16px 20px
Border-left: 4px solid [semantic color]
Background:  #FFFFFF
Shadow:      var(--shadow-lg)
Border-radius: 0

Font:        title DM Sans 14px 500, #221E2A
             body DM Sans 13px, #4a5568
Close:       X icon, 16px, top-right

Variants:
  success: border-color #22c55e, icon Lucide CheckCircle2 #22c55e
  error:   border-color #ef4444, icon Lucide XCircle #ef4444
  info:    border-color #0ED2E9, icon Lucide Info #0ED2E9
  warning: border-color #f59e0b, icon Lucide AlertTriangle #f59e0b

Auto-dismiss: 4000ms, animate slide-out right
```

---

## Overrides vs MASTER (Summary)

| Token / Rule | MASTER | Admin Override |
|-------------|--------|----------------|
| Section padding-y | 80–140px | 32px (content area padding) |
| Section label (eyebrow) | Required on every section | NOT used (functional context) |
| Section color alternation | dark/light alternating | NOT applicable (sidebar layout) |
| Grain overlay | Required on dark sections | NOT used (data context) |
| Cormorant Garamond | Pull quotes / taglines | NOT USED in admin |
| Card hover translateY | -6px | Not used (no hover lift in tables) |
| Body max-width: 68ch | Always enforce | Not applicable (data tables full-width) |
| Animations | Staggered scroll reveals | Minimal — only toasts, sidebar transitions |
| Hero sections | Cinematic, full-bleed | NOT present in admin |

---

## Admin Auth Page (`/admin/login`)

```
Background:  #221E2A + grain
Layout:      Centered, card

Card:
  Background: #FFFFFF
  Padding: 48px 40px
  Width: 400px, radius: 0, shadow-xl

Logo: centered top, teal variant
Heading: "Welcome Back" — Josefin Sans 24px 700, #221E2A, margin-bottom: 4px
Sub: DM Sans 14px, #718096

Form:
  Email input + Password input (MASTER spec)
  "Remember me" checkbox (DM Sans 13px)
  Teal btn "Sign In" (full-width), margin-top: 24px
  Forgot password: DM Sans 13px, #285056, center, margin-top: 16px

Google sign-in:
  Separator: OR (DM Sans 12px #718096 with lines)
  Button: border 1px solid rgba(34,30,42,0.14), bg white, flex center + Google logo + "Continue with Google"
```
