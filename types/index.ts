export const PACKAGE_CATEGORIES = [
  'Culinary',
  'Spiritual',
  'Adventure',
  'Beach',
  'Culture',
  'Wildlife',
  'Safari',
  'Heritage',
  'Hippy Trail',
  'Corporate Retreat',
  'Romance',
  'Wellness',
] as const;

export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];
export type PackageMarket = 'global' | 'india';

export interface Package {
  id: string;
  title: string;
  slug: string;
  market?: PackageMarket;
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
  cancellationPolicy?: string;   // e.g. "Free cancellation up to 30 days before departure"
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
  activity?: string;
  activityDetails?: string;
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
  // Stamped by updateBlog on every edit. Optional because posts written before
  // this field existed do not have it — BlogPosting.dateModified falls back to
  // publishDate in that case, which is the honest value for an unedited post.
  updatedAt?: string;
}

export type StoredEnquiryVariant = 'contact' | 'package-booking' | 'b2c' | 'corporate';

export type EnquiryFormData = Record<string, string | string[]>;

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
  source?: string;
  submittedVia?: string;
  formVariant?: StoredEnquiryVariant;
  formData?: EnquiryFormData;
  affiliateSessionId?: string;
  createdAt: string;
}

export type JobOpeningStatus = 'draft' | 'published' | 'closed';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type JobLocationType = 'onsite' | 'hybrid' | 'remote';
export type SalaryPeriod = 'YEAR' | 'MONTH';

export interface JobOpening {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;           // e.g. "Kochi, India"
  locationType: JobLocationType;
  type: JobType;
  descriptionHtml: string;
  responsibilities: string[];
  requirements: string[];
  // Nullable rather than optional: the Firestore client SDK rejects `undefined`,
  // and a blank salary must round-trip through the admin form as an explicit null.
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;     // ISO 4217, e.g. "INR"
  salaryPeriod: SalaryPeriod;
  status: JobOpeningStatus;
  order: number;              // manual sort on the public listing, ascending
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'new' | 'shortlisted' | 'interviewing' | 'hired' | 'rejected';

// Written only by app/api/careers/apply/route.ts via the Admin SDK — firestore.rules
// give browsers no create access. Candidate PII: deliberately no IP or user-agent.
export interface JobApplication {
  id: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;           // denormalized so it survives the opening being deleted
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  coverNote: string;
  noticePeriod: string;
  yearsExperience: string;    // a band, not a number — avoids fake precision
  cvPath: string | null;      // Storage path, never a download URL
  cvFilename: string | null;
  cvSize: number | null;
  cvContentType: string | null;
  status: ApplicationStatus;
  notes: string;              // internal admin notes
  source: string;
  createdAt: string;
  updatedAt: string;
}

export type ClubApplicationStatus = 'new' | 'shortlisted' | 'invited' | 'declined';

/** One answer to one Traveler Vibe Match question. See lib/personality-quiz.ts. */
export interface ClubQuizAnswer {
  questionId: string;
  choice: string;
}

// The Curious Club membership application. Written only by
// app/api/curious-club/apply/route.ts via the Admin SDK — firestore.rules give
// browsers no create access, so the zod schema in lib/club-application.ts
// cannot be sidestepped.
//
// Answers are personal (date of birth, gender, phone, email). Never publicly
// readable, and deliberately no IP or user-agent stored alongside them.
export interface ClubApplication {
  id: string;
  fullName: string;
  /** ISO yyyy-mm-dd. Age is derived on read, never stored — it goes stale. */
  dateOfBirth: string;
  gender: string;
  city: string;
  phone: string;
  email: string;
  discoverySource: string;
  /** The random six of ten they were served, in the order they answered them. */
  quizAnswers: ClubQuizAnswer[];
  /** Scored server-side from quizAnswers: 'spark' | 'magnet' | 'anchor' | 'architect'. */
  personality: string;
  /** Slug of the trip page that sent them here, '' for a direct application. */
  trip: string;
  status: ClubApplicationStatus;
  notes: string;              // internal admin notes
  source: string;
  createdAt: string;
  updatedAt: string;
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
  affiliateSessionId?: string;
  affiliateBookingAttributedAt?: string;
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

export interface Testimonial {
  id: string;
  authorName: string;
  location: string;          // e.g. "Kerala, India" — free text
  quote: string;
  rating: number;            // 1–5
  avatarUrl?: string;        // optional; omit rather than use stock photography
  market?: PackageMarket;    // which homepage it appears on; undefined = both
  status: 'draft' | 'published';
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
  emailHash?: string;
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

export interface AffiliatePublic {
  code: string;
  name: string;
  status: AffiliateStatus;
  totalClicks: number;
  totalLeads: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateEvent {
  id: string;
  affiliateCode: string;
  pageUrl: string;
  packageSlug?: string;
  referrer?: string;
  sessionId: string;          // for deduplication
  convertedToEnquiry: boolean;
  convertedToBooking: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AffiliateClick extends AffiliateEvent {
  affiliateId: string;
}

export interface AffiliateRegistrationIndex {
  emailHash: string;
  affiliateId: string;
  affiliateCode: string;
  createdAt: string;
}
