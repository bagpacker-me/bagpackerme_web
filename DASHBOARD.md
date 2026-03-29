# BagPackerMe — Admin Dashboard Documentation

> Internal content management system for managing travel packages, blog posts, enquiries, bookings, customers, and media gallery.
> Protected by Firebase Authentication.

---

## Table of Contents

- [Authentication](#authentication)
- [Layout Architecture](#layout-architecture)
- [Route Map](#route-map)
- [Dashboard](#dashboard-admindashboard)
- [Content Management](#content-management)
  - [Packages](#packages-crud)
  - [Blog Posts](#blog-posts-crud)
  - [Gallery](#gallery)
- [Customer Relationship Management](#customer-relationship-management)
  - [Enquiries](#enquiries)
  - [Bookings](#bookings)
  - [Customers](#customers)
- [Analytics](#analytics-adminanalytics)
- [Settings](#settings)
- [CRUD Operations Summary](#crud-operations-summary)
- [Data Models](#data-models)
- [Firestore Operations](#firestore-operations)
- [Shared Admin Components](#shared-admin-components)
- [Environment Variables](#environment-variables)

---

## Authentication

### Login Page
**File:** `app/(admin)/admin/login/page.tsx`

- **Route:** `/admin/login`
- Clean centered card with logo, email/password fields
- Firebase `signInWithEmailAndPassword` via `loginAdmin(email, password)` from `lib/auth.ts`
- On success: redirects to `/admin/dashboard`
- On failure: "Invalid credentials. Please try again." error banner
- Loading state with spinner during auth

### Auth Guard
**File:** `app/(admin)/layout.tsx`

- All admin routes (except `/admin/login`) are protected
- `useAuth()` hook checks Firebase auth state
- Unauthenticated users are redirected to `/admin/login`
- Loading state shows spinner while checking auth
- `PUBLIC_PATHS = ['/admin/login']` — exempted from auth check

### Admin Verification
**File:** `hooks/useAuth.ts`

- `isAdmin` computed by checking user email against:
  - `NEXT_PUBLIC_ADMIN_EMAIL` environment variable, OR
  - Hardcoded fallback: `admin@bagpackerme.com`

### Auth Functions
**File:** `lib/auth.ts`

| Function | Description |
|----------|-------------|
| `loginAdmin(email, password)` | Signs in with Firebase email/password |
| `logoutAdmin()` | Signs out the current user |
| `onAuthStateChanged(callback)` | Listens for auth state changes |

---

## Layout Architecture

### Admin Layout
**File:** `app/(admin)/layout.tsx`

```
┌──────────────────────────────────────────────────────┐
│  AdminSidebar (240px fixed)  │  Main Content Area    │
│                              │                       │
│  ┌────────────────────────┐  │  ┌─────────────────┐  │
│  │ Logo        [X mobile] │  │  │ AdminTopBar     │  │
│  ├────────────────────────┤  │  │ (breadcrumbs,   │  │
│  │ OVERVIEW               │  │  │  search, theme, │  │
│  │  Dashboard             │  │  │  notifications) │  │
│  │  Analytics             │  │  ├─────────────────┤  │
│  ├────────────────────────┤  │  │                 │  │
│  │ CONTENT                │  │  │  Page Content   │  │
│  │  Packages              │  │  │                 │  │
│  │  Blog Posts            │  │  │                 │  │
│  │  Gallery               │  │  │                 │  │
│  ├────────────────────────┤  │  │                 │  │
│  │ BOOKINGS               │  │  │                 │  │
│  │  Enquiries [badge]     │  │  │                 │  │
│  │  Bookings              │  │  │                 │  │
│  │  Customers             │  │  │                 │  │
│  ├────────────────────────┤  │  │                 │  │
│  │ SETTINGS               │  │  │                 │  │
│  │  Site Settings         │  │  │                 │  │
│  │  Team                  │  │  └─────────────────┘  │
│  ├────────────────────────┤  │                       │
│  │ user@email.com         │  │                       │
│  │ [Log out]              │  │                       │
│  └────────────────────────┘  │                       │
└──────────────────────────────────────────────────────┘
```

- **Theme:** Dark mode support via `next-themes` (`ThemeProvider` with `class` strategy)
- **Background:** Light `#F7F9FA`, Dark `#1A1625`
- **Responsive:** Sidebar hidden on mobile with hamburger toggle, overlay backdrop

### AdminSidebar
**File:** `components/admin/AdminSidebar.tsx`

- **Width:** 240px fixed
- **Background:** Linear gradient `#285056` → `#1e3d42` (teal)
- **Active state:** White background highlight, lime `#C1EA00` left border accent (3px), lime icon color
- **Inactive state:** 70% white text, transparent background, hover 8% white overlay
- **Badge:** Lime pill on Enquiries item showing count
- **User area:** Displays email, logout button (hover turns red)
- **Mobile:** Full overlay with backdrop, close button

### AdminTopBar
**File:** `components/admin/AdminTopBar.tsx`

- **Height:** 64px sticky
- **Dynamic page title** extracted from URL path segments
- **Breadcrumb** navigation trail
- **Search input** (placeholder functionality)
- **Theme toggle** (sun/moon icon via `next-themes`)
- **Notification bell** with badge indicator
- **User avatar** with initials

---

## Route Map

| Path | Page | Description |
|------|------|-------------|
| `/admin/login` | Login | Firebase email/password authentication |
| `/admin` | Redirect | Redirects to `/admin/dashboard` |
| `/admin/dashboard` | Dashboard | Stats overview, quick actions, recent enquiries |
| `/admin/analytics` | Analytics | Aggregate metrics overview |
| `/admin/packages` | Packages List | All packages with CRUD actions |
| `/admin/packages/new` | New Package | Create package (PackageForm) |
| `/admin/packages/[id]` | Edit Package | Edit existing package (PackageForm) |
| `/admin/blog` | Blog List | All blog posts with CRUD actions |
| `/admin/blog/new` | New Blog Post | Create blog post (BlogForm) |
| `/admin/blog/[id]` | Edit Blog Post | Edit existing blog post (BlogForm) |
| `/admin/gallery` | Gallery | Upload and manage images |
| `/admin/enquiries` | Enquiries | View and manage customer enquiries |
| `/admin/bookings` | Bookings | View and manage bookings |
| `/admin/customers` | Customers | Customer database |
| `/admin/settings` | Settings | Site settings (coming soon) |

---

## Dashboard (`/admin/dashboard`)

**File:** `app/(admin)/admin/dashboard/page.tsx`

### Stats Cards (Top Row)
4 metric cards fetched via parallel Firestore queries:

| Card | Metric | Source |
|------|--------|--------|
| Published Packages | Count of packages with `status: 'published'` | `packages` collection |
| Published Blog Posts | Count of blogs with `status: 'published'` | `blogs` collection |
| New Enquiries | Count of enquiries from last 7 days | `enquiries` collection |
| Newsletter Subscribers | Total subscriber count | `subscribers` collection |

### Quick Actions
- **"New Package"** button → `/admin/packages/new`
- **"New Blog Post"** button → `/admin/blog/new`

### Recent Enquiries Table
- Shows last 5 enquiries
- Columns: Name, Email, Package, Inquiry Type, Date, Status
- **Status badges:**
  - New — blue (`#E0F7FF`)
  - In Progress — yellow (`#FEF9C3`)
  - Responded — green (`#DCFCE7`)
- Click row to open **slide-over detail panel:**
  - Full enquiry information
  - Reply via Email (mailto link)
  - Reply via WhatsApp (pre-composed message)
  - "View All" link to `/admin/enquiries`

---

## Content Management

### Packages CRUD

#### Package Listing (`/admin/packages`)
**File:** `app/(admin)/admin/packages/page.tsx`

- Table view of all packages (drafts and published)
- Columns: Image, Title, Category, Duration, Price, Status, Actions
- Status toggle (publish/unpublish)
- Edit button → `/admin/packages/[id]`
- Delete with confirmation dialog
- Skeleton loading states

#### Package Form (`/admin/packages/new` and `/admin/packages/[id]`)
**File:** `components/admin/PackageForm.tsx`

A tabbed form with 4 sections:

**Tab 1 — Basic Info:**

| Field | Type | Details |
|-------|------|---------|
| Title | Text input | Auto-generates slug via `slugify` |
| Slug | Text input | URL-friendly identifier |
| Category | Select dropdown | Culinary, Spiritual, Adventure, Heritage, Hippy Trail, Corporate Retreat |
| Subtheme | Text input | Optional sub-category |
| Tagline | Text input | Short description |
| Hero Image | File upload | Single image upload to Firebase Storage with progress bar |
| Gallery Images | Multi-file upload | Multiple images to Firebase Storage |
| Duration | Text input | e.g., "5 Days / 4 Nights" |
| Group Size | Text input | e.g., "8-12 people" |
| Price (INR) | Number input | Price in Indian Rupees |
| Price (USD) | Number input | Optional price in US Dollars |
| Destinations | Tag input | Multi-tag input via `TagInput` component |
| Vibe | Text input | Optional mood/vibe description |
| Location Idea | Text input | Optional location inspiration |
| Status | Select | Draft or Published |

**Tab 2 — Content:**

| Field | Type | Details |
|-------|------|---------|
| Overview | Rich text editor | TipTap `RichTextEditor` for HTML content |

**Tab 3 — Itinerary:**

Multi-day itinerary builder:

| Field | Type | Details |
|-------|------|---------|
| Day Number | Number | Sequential day number |
| Location | Text input | Day's location |
| Description | Textarea | Day's activities description |
| Image | File upload | Optional image per day |

- Add/remove day buttons
- Reorder capability

**Tab 4 — Inclusions:**

| Field | Type | Details |
|-------|------|---------|
| Accommodation | Toggle | Boolean |
| Meals | Toggle | Boolean |
| Transfers | Toggle | Boolean |
| Guides | Toggle | Boolean |
| Flights | Toggle | Boolean |
| Activities | Toggle | Boolean |
| Exclusions | List | Text items for what's NOT included |

**Additional fields:** Meta Title, Meta Description (SEO)

**Image upload:** Uses Firebase Storage `uploadBytesResumable` with progress tracking.

---

### Blog Posts CRUD

#### Blog Listing (`/admin/blog`)
**File:** `app/(admin)/admin/blog/page.tsx`

- Table view of all blog posts (drafts and published)
- Status toggle, Edit, Delete actions
- Ordered by `createdAt` descending

#### Blog Form (`/admin/blog/new` and `/admin/blog/[id]`)
**File:** `components/admin/BlogForm.tsx`

A tabbed form with 2 sections:

**Tab 1 — Content:**

| Field | Type | Details |
|-------|------|---------|
| Title | Text input | Auto-generates slug |
| Slug | Text input | URL-friendly identifier |
| Category | Select dropdown | Adventure, Culture, Food, Spiritual, Tips & Guides, Corporate Travel |
| Featured Image | File upload | Single image upload to Firebase Storage |
| Excerpt | Textarea | Short summary for listings |
| Author | Text input | Default: "Kevin" |
| Publish Date | Date input | Defaults to today |
| Read Time | Number input | Estimated reading time in minutes |
| Content | Rich text editor | TipTap `RichTextEditor` for HTML content |
| Status | Select | Draft or Published |

**Tab 2 — SEO:**

| Field | Type | Details |
|-------|------|---------|
| Meta Title | Text input | SEO title tag |
| Meta Description | Textarea | SEO meta description |

---

### Gallery

**File:** `app/(admin)/admin/gallery/page.tsx`

- **Upload:** Modal with title, category, and image file input
- **Display:** Responsive grid of uploaded images
- **Delete:** Hover-to-reveal delete button with confirmation
- **Storage:** Images uploaded to Firebase Storage, metadata stored in Firestore `gallery` collection
- **No edit** functionality for existing images

---

## Customer Relationship Management

### Enquiries

**File:** `app/(admin)/admin/enquiries/page.tsx`

#### Status Filters
Tab buttons to filter by status:
- **All** — shows everything
- **New** — unread enquiries (blue badge)
- **In Progress** — being handled (yellow badge)
- **Responded** — replied to (green badge)

#### Enquiry Table
Columns: Name, Email, Phone, Inquiry Type, Package, Date, Status, Actions

#### Slide-Over Detail Panel
Opens on row click, showing full enquiry details:

| Field | Description |
|-------|-------------|
| Name | Customer's full name |
| Email | Contact email |
| Phone | Phone number |
| Inquiry Type | Group Trip, Personalised Itinerary, Corporate Retreat, Media & Partnership, Other |
| Package | Related package slug (if any) |
| Group Size | Number of travelers |
| Travel Date | Preferred travel date |
| Message | Full enquiry message |
| Status | Changeable via dropdown |

**Actions:**
- **Reply via Email** — opens `mailto:` link
- **Reply via WhatsApp** — opens WhatsApp with pre-composed message
- **Update Status** — change between new, in_progress, responded
- **Delete** — remove enquiry with confirmation

#### Export
- **CSV Export** — downloads all enquiries as CSV file

---

### Bookings

**File:** `app/(admin)/admin/bookings/page.tsx`

#### Status Filters
- All, Pending, Confirmed, Completed, Cancelled

#### Booking Table
Columns: Booking ID, Customer Name, Package Name, Travel Date, Total Price, Group Size, Status, Actions

#### Slide-Over Detail Panel
- Customer information (fetched via `getCustomer(customerId)`)
- Full booking details
- **Status update** dropdown
- **Delete** with confirmation

#### Status Badge Colors
| Status | Color |
|--------|-------|
| Pending | Yellow |
| Confirmed | Blue |
| Completed | Green |
| Cancelled | Red |

---

### Customers

**File:** `app/(admin)/admin/customers/page.tsx`

#### Customer Table
Columns: Name, Email, Phone, Total Bookings, Joined Date

#### Slide-Over Detail Panel
- Customer ID
- Phone number
- Booking count
- Joined date

#### Actions
- **CSV Export** — downloads customer list
- **Delete** — removes customer (with warning about orphaned bookings)

---

## Analytics (`/admin/analytics`)

**File:** `app/(admin)/admin/analytics/page.tsx`

4 overview cards with aggregate counts:

| Card | Source |
|------|--------|
| Total Customers | `customers` collection count |
| Total Bookings | `bookings` collection count |
| Total Enquiries | `enquiries` collection count |
| Active Packages | `packages` collection (published) count |

Data fetched via parallel Firestore queries.

---

## Settings

**File:** `app/(admin)/admin/settings/page.tsx`

- Placeholder page: **"Admin settings. Coming soon."**
- Team page (`/admin/team`) listed in sidebar navigation but route not yet implemented

---

## CRUD Operations Summary

| Resource | Collection | Create | Read | Update | Delete | Public Access |
|----------|-----------|--------|------|--------|--------|---------------|
| Packages | `packages` | PackageForm | List + Detail | PackageForm | Confirm dialog | Read (published only) |
| Blog Posts | `blogs` | BlogForm | List + Detail | BlogForm | Confirm dialog | Read (published only) |
| Gallery | `gallery` | Upload modal | Grid view | N/A | Confirm dialog | Read |
| Enquiries | `enquiries` | User-generated | Table + slide-over | Status only | Confirm dialog | Create only (contact form) |
| Bookings | `bookings` | User-generated | Table + slide-over | Status only | Confirm dialog | N/A |
| Customers | `customers` | User-generated | Table + slide-over | Auto-updated | Confirm dialog | N/A |
| Subscribers | `subscribers` | User-generated | Dashboard count | N/A | N/A | Create only (newsletter) |

---

## Data Models

All interfaces defined in `types/index.ts`:

### Package
```typescript
interface Package {
  id: string;
  title: string;
  slug: string;
  category: 'Culinary' | 'Spiritual' | 'Adventure' | 'Heritage' | 'Hippy Trail' | 'Corporate Retreat';
  subTheme?: string;
  tagline: string;
  heroImageUrl: string;
  galleryUrls: string[];
  duration: string;
  groupSize: string;
  priceInr: number;
  priceUsd?: number;
  destinations: string[];
  overviewHtml: string;
  itinerary: ItineraryDay[];
  inclusions: Inclusions;
  exclusions: string[];
  vibe?: string;
  locationIdea?: string;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}
```

### ItineraryDay
```typescript
interface ItineraryDay {
  day: number;
  location: string;
  description: string;
  imageUrl?: string;
}
```

### Inclusions
```typescript
interface Inclusions {
  accommodation: boolean;
  meals: boolean;
  transfers: boolean;
  guides: boolean;
  flights: boolean;
  activities: boolean;
}
```

### BlogPost
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  featuredImageUrl: string;
  excerpt: string;
  contentHtml: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published';
  readTimeMinutes: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}
```

### Enquiry
```typescript
interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  packageSlug?: string;
  groupSize?: number;
  travelDate?: string;
  message: string;
  status: 'new' | 'in_progress' | 'responded';
  createdAt: string;
}
```

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  createdAt: string;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  customerId: string;
  packageId: string;
  packageName: string;
  travelDate: string;
  groupSize: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}
```

### GalleryImage
```typescript
interface GalleryImage {
  id: string;
  url: string;
  title: string;
  altText: string;
  category: string;
  createdAt: string;
}
```

---

## Firestore Operations

All functions defined in `lib/firestore.ts`:

### Packages (`packages` collection)

| Function | Type | Description |
|----------|------|-------------|
| `getPackages()` | Read | Get all packages (admin) |
| `getPublishedPackages()` | Read | Get published packages only |
| `getFeaturedPackages(count)` | Read | Get N published packages |
| `getPackage(id)` | Read | Get single package by ID |
| `getPackageBySlug(slug)` | Read | Get published package by slug |
| `getRelatedPackages(category, excludeSlug, count)` | Read | Get related published packages |
| `createPackage(data)` | Write | Create new package |
| `updatePackage(id, data)` | Write | Update package fields |
| `deletePackage(id)` | Delete | Remove package |

### Blog Posts (`blogs` collection)

| Function | Type | Description |
|----------|------|-------------|
| `getBlogs()` | Read | Get all blogs ordered by `createdAt` desc |
| `getPublishedBlogs()` | Read | Get published blogs, sorted client-side |
| `getRecentPublishedBlogs(count)` | Read | Get N most recent published blogs |
| `getBlog(id)` | Read | Get single blog by ID |
| `getBlogBySlug(slug)` | Read | Get published blog by slug |
| `getRelatedBlogs(category, excludeSlug, count)` | Read | Get related published blogs |
| `createBlog(data)` | Write | Create new blog post |
| `updateBlog(id, data)` | Write | Update blog fields |
| `deleteBlog(id)` | Delete | Remove blog post |

### Enquiries (`enquiries` collection)

| Function | Type | Description |
|----------|------|-------------|
| `getEnquiries()` | Read | Get all enquiries ordered by `createdAt` desc |
| `getEnquiry(id)` | Read | Get single enquiry |
| `createEnquiry(data)` | Write | Create enquiry (from contact form) |
| `updateEnquiry(id, data)` | Write | Update enquiry (status changes) |
| `deleteEnquiry(id)` | Delete | Remove enquiry |

### Subscribers (`subscribers` collection)

| Function | Type | Description |
|----------|------|-------------|
| `getSubscribers()` | Read | Get all subscribers |
| `createSubscriber(data)` | Write | Add subscriber (newsletter form) |
| `deleteSubscriber(id)` | Delete | Remove subscriber |

### Customers (`customers` collection)

| Function | Type | Description |
|----------|------|-------------|
| `getCustomers()` | Read | Get all customers ordered by `createdAt` desc |
| `getCustomer(id)` | Read | Get single customer |
| `createCustomer(data)` | Write | Create customer |
| `updateCustomer(id, data)` | Write | Update customer fields |
| `deleteCustomer(id)` | Delete | Remove customer |

### Bookings (`bookings` collection)

| Function | Type | Description |
|----------|------|-------------|
| `getBookings()` | Read | Get all bookings ordered by `createdAt` desc |
| `getBooking(id)` | Read | Get single booking |
| `createBooking(data)` | Write | Create booking |
| `updateBooking(id, data)` | Write | Update booking (status changes) |
| `deleteBooking(id)` | Delete | Remove booking |

### Gallery (`gallery` collection)

| Function | Type | Description |
|----------|------|-------------|
| `getGalleryImages()` | Read | Get all images ordered by `createdAt` desc |
| `addGalleryImage(data)` | Write | Add image metadata |
| `deleteGalleryImage(id)` | Delete | Remove image metadata |

---

## Shared Admin Components

| Component | File | Description |
|-----------|------|-------------|
| `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Fixed sidebar navigation with 4 sections, active state indicators, user area with logout |
| `AdminTopBar` | `components/admin/AdminTopBar.tsx` | Sticky top bar with breadcrumbs, search, theme toggle, notifications, avatar |
| `PackageForm` | `components/admin/PackageForm.tsx` | 4-tab form for creating/editing packages (Basic Info, Content, Itinerary, Inclusions) |
| `BlogForm` | `components/admin/BlogForm.tsx` | 2-tab form for creating/editing blog posts (Content, SEO) |
| `RichTextEditor` | `components/admin/RichTextEditor.tsx` | TipTap-based WYSIWYG editor for HTML content |
| `TagInput` | `components/admin/TagInput.tsx` | Multi-tag input component (used for package destinations) |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin email for auth verification (fallback: `admin@bagpackerme.com`) |
