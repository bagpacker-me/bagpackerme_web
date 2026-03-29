# BagPackerMe — Complete Setup Guide

## Overview

BagPackerMe is a full-stack travel platform built with **Next.js 14 (App Router)**, **Firebase (Auth, Firestore, Storage)**, **TailwindCSS**, **Framer Motion**, and **TipTap**.

---

## 1. Firebase Project Setup

### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. Name it `bagpackerme` → Continue
3. Disable Google Analytics (optional) → Create project

### Enable Firebase Services
- **Authentication** → Sign-in method → Email/Password → Enable
- **Firestore** → Start in production mode → Choose region (e.g., `asia-southeast1`)
- **Storage** → Start in production mode → Choose same region

### Register a Web App
1. Project Overview → **Add app** → Web (</> icon)
2. Register as `BagPackerMe Web`
3. Copy the Firebase config (used in next step)

---

## 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 3. Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

---

## 4. Seeding the Database

A seed script populates Firestore with 12 sample travel packages.

```bash
# Run the seed script
npx ts-node scripts/seed.ts
```

Or use the provided bash wrapper:
```bash
bash seed.bash
```

> **Note:** Ensure your `.env.local` is configured before running the seed.

---

## 5. Creating the First Admin User

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Authentication**
2. Click **Add user**
3. Enter your admin email and a strong password → **Add user**
4. Admin login is available at `/admin/login`

---

## 6. Firestore Security Rules

In the Firebase Console → **Firestore** → **Rules**, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /packages/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /blogs/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /enquiries/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /subscribers/{doc} {
      allow create: if true;
      allow read, delete: if request.auth != null;
    }
  }
}
```

Click **Publish** to apply.

---

## 7. Firebase Storage Rules

In Firebase Console → **Storage** → **Rules**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 8. Project Structure

```
app/
├── (public)/         # Public-facing pages (home, packages, blog, about, contact)
├── (admin)/          # Protected admin panel
│   └── admin/
│       ├── dashboard/
│       ├── packages/ # Packages CRUD
│       ├── blog/     # Blog CRUD
│       └── enquiries/
├── sitemap.ts        # Dynamic SEO sitemap
└── robots.ts         # robots.txt

components/
├── admin/            # AdminSidebar, PackageForm, BlogForm, RichTextEditor
├── layout/           # Navbar, Footer, PageTransition
└── ui/               # Shared UI components
```

---

## 9. Admin Panel

| Route | Description |
|-------|-------------|
| `/admin/login` | Firebase email/password login |
| `/admin/dashboard` | Stats overview + recent enquiries |
| `/admin/packages` | Manage travel packages |
| `/admin/blog` | Manage blog posts |
| `/admin/enquiries` | View and respond to customer enquiries |

---

## 10. Key Technologies

| Technology | Use |
|-----------|-----|
| Next.js 14 | App Router, SSG, Server Components |
| Firebase Auth | Admin authentication |
| Cloud Firestore | Database for packages, blogs, enquiries |
| Firebase Storage | Image uploads |
| TipTap | Rich text editor for blog content |
| Framer Motion | Page transition animations |
| TailwindCSS | Utility-first styling |
| date-fns | Date formatting |
| react-hot-toast | Toast notifications |
