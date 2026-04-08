export interface Package {
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
