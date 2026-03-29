# BagPackerMe Web

Travel platform for curated India trip packages. Next.js 14 (App Router) + Firebase + TailwindCSS.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

```
app/
  (public)/          # Customer-facing website (7 routes)
    page.tsx         # Homepage
    packages/        # Listing + [slug] detail
    blog/            # Listing + [slug] post
    about/           # About page
    contact/         # Contact form
  (admin)/           # Admin dashboard (auth-guarded)
    admin/
      login/         # Firebase email/password auth
      dashboard/     # Stats overview
      packages/      # CRUD + new/edit forms
      blog/          # CRUD + new/edit forms
      enquiries/     # CRM - customer inquiries
      bookings/      # Booking management
      customers/     # Customer records
      gallery/       # Image management
      analytics/     # Analytics overview
      settings/      # Site settings
  api/               # API routes
components/
  home/              # Homepage sections (Hero, Stats, FeaturedTrips, etc.)
  layout/            # Navbar, Footer, PageTransition, FadeInSection
  packages/          # PackageCard, PackageDetail sub-components
  blog/              # BlogCard, blog detail components
  admin/             # AdminSidebar, AdminTopBar, PackageForm, BlogForm, RichTextEditor, TagInput
  ui/                # Shared UI primitives
lib/
  firebase.ts        # Firebase app initialization
  firestore.ts       # All Firestore CRUD operations (7 collections)
  auth.ts            # Auth helpers
hooks/
  useAuth.ts         # Auth state hook (guards admin routes)
types/
  index.ts           # All TypeScript interfaces
```

## Key Conventions

- **Path alias**: `@/*` maps to project root
- **Route groups**: `(public)` for website, `(admin)` for dashboard -- parentheses are Next.js route groups, not filesystem paths
- **Data layer**: All Firestore operations are in `lib/firestore.ts` -- never call Firestore directly from components
- **Types**: All interfaces in `types/index.ts` -- Package, BlogPost, Enquiry, Customer, Booking, GalleryImage
- **Styling**: TailwindCSS with custom tokens defined in `tailwind.config.ts` and `styles/globals.css`
- **Animations**: Framer Motion for page transitions, scroll-linked effects, parallax
- **Forms**: React Hook Form + Zod validation (contact form, admin forms)
- **Rich text**: TipTap editor for blog/package content (admin)
- **Images**: Next.js Image with domains: `images.unsplash.com`, `firebasestorage.googleapis.com`

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `teal` | `#285056` | Primary brand, buttons, sidebar |
| `lime` | `#C1EA00` | Accent, CTAs, active states |
| `cyan` | `#0ED2E9` | Tags, badges, highlights |
| `void` | `#221E2A` | Dark backgrounds |
| `ice` | `#E9F5F7` | Light backgrounds |

Fonts: `font-display` (Josefin Sans), `font-body`/`font-sans` (DM Sans), `font-accent` (Cormorant Garamond)

## Firestore Collections

| Collection | Used By | Operations |
|------------|---------|------------|
| `packages` | Public + Admin | Full CRUD, query by slug/category/status |
| `blogs` | Public + Admin | Full CRUD, query by slug/category/status |
| `enquiries` | Contact form + Admin | Create (public), read/update/delete (admin) |
| `subscribers` | Newsletter + Admin | Create (public), read/delete (admin) |
| `customers` | Admin only | Full CRUD |
| `bookings` | Admin only | Full CRUD |
| `gallery` | Admin only | Create, read, delete |

## Environment Variables

All in `.env.local` -- Firebase config keys (`NEXT_PUBLIC_FIREBASE_*`) and `NEXT_PUBLIC_ADMIN_EMAIL`.

## Gotchas

- Blog sorting is done client-side (JS `.sort()`) to avoid Firestore composite index requirements -- see `getPublishedBlogs` in `lib/firestore.ts`
- Admin auth guard is in `app/(admin)/layout.tsx` -- checks `useAuth()` and redirects to `/admin/login`
- Package categories are a fixed union type: `'Culinary' | 'Spiritual' | 'Adventure' | 'Heritage' | 'Hippy Trail' | 'Corporate Retreat'`
- Dark mode via `next-themes` with `class` strategy
- Enquiry/Booking status enums are defined in `types/index.ts`, not in a separate constants file
