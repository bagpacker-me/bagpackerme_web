export const PACKAGE_CATEGORIES = [
  'Culinary',
  'Spiritual',
  'Adventure',
  'Wildlife',
  'Heritage',
  'Hippy Trail',
  'Corporate Retreat',
  'Romance',
  'Wellness',
] as const;

export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];

export interface Package {
  id: string;
  title: string;
  slug: string;
  category: PackageCategory;
  subTheme?: string;
  tagline: string;
  heroImageUrl: string;
  galleryUrls: string[];
  duration: string;
  groupSize: string;
  priceInr?: number | null;
  priceUsd?: number | null;
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

export interface ItineraryDay {
  day: number;
  location: string;
  description: string;
  imageUrl?: string;
}

export interface Inclusions {
  accommodation: boolean;
  meals: boolean;
  transfers: boolean;
  guides: boolean;
  flights: boolean;
  activities: boolean;
}

export interface BlogPost {
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

export interface Enquiry {
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
  affiliateCode?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  packageId: string;
  packageName: string;
  travelDate: string;
  groupSize: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  affiliateCode?: string;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  altText: string;
  category: string;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface SiteSettings {
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  address?: string;
  workingHours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  updatedAt?: string;
}

export type AffiliateStatus = 'pending' | 'active' | 'paused' | 'rejected';

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  socialHandle?: string;
  code: string;               // e.g. "BP-JOHN42" — unique
  status: AffiliateStatus;
  commissionRate: number;     // percentage, default 10
  totalClicks: number;
  totalLeads: number;         // enquiries attributed
  totalBookings: number;
  notes?: string;             // admin-only notes
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateClick {
  id: string;
  affiliateCode: string;
  affiliateId: string;
  pageUrl: string;
  packageSlug?: string;
  referrer?: string;
  sessionId: string;          // for deduplication
  convertedToEnquiry: boolean;
  convertedToBooking: boolean;
  createdAt: string;
}
