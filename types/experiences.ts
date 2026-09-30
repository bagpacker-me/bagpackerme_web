// Shapes returned by the n8n Experience Catalogue / Availability / Trip APIs.
// These mirror the webhook contracts exactly — if a workflow's response changes,
// this file is the one place the site has to change with it.

export interface ExperienceCard {
  productCode: string;
  title: string;
  blurb: string;
  photo: string;
  durationLabel: string;
  durationMinutes: number;
  rating: number;
  reviewCount: number;
  fromPriceInr: number;
  freeCancellation: boolean;
  likelyToSellOut: boolean;
  destinationSlug: string;
}

export interface ExperienceCardsResponse {
  destination: string;
  count: number;
  experiences: ExperienceCard[];
}

export interface ExperiencePhoto {
  url: string;
  caption: string;
}

export interface ExperienceProductOption {
  productOptionCode: string;
  title: string;
}

export interface ExperienceDetail {
  productCode: string;
  title: string;
  description: string;
  photos: ExperiencePhoto[];
  highlights: string[];
  included: string[];
  excluded: string[];
  meetingPoint: string;
  cancellationPolicy: string;
  cancellationType: string;
  rating: number;
  reviewCount: number;
  fromPriceInr: number;
  durationLabel: string;
  destinationSlug: string;
  productUrl: string;
  confirmationType: string;
  /**
   * Derived from the Viator schedule's seasons and weekdays — a calendar hint,
   * not a promise. Only checkAvailability() confirms a real date.
   */
  availableDates: string[];
  startTimes: string[];
  productOptions: ExperienceProductOption[];
}

export interface AvailabilityOption {
  productOptionCode: string;
  available: boolean;
  startTimes: string[];
  priceInr: number;
  estimatedCommissionInr: number;
  unavailableReason: string;
}

export interface AvailabilityResult {
  productCode: string;
  travelDate: string;
  travellers: number;
  adults: number;
  children: number;
  infants: number;
  currency: string;
  available: boolean;
  fromPriceInr: number;
  options: AvailabilityOption[];
  /** Present only when the Viator lookup itself failed — not the same as sold out. */
  unavailableReason?: string;
  message?: string;
}

export interface TripItem {
  itemId: string;
  productCode: string;
  title: string;
  destinationSlug: string;
  travelDate: string;
  adults: number;
  children: number;
  infants: number;
  travellers: number;
  productOptionCode: string;
  startTime: string;
  priceInr: number;
  status: 'added' | 'booking' | 'enquired' | 'removed';
  addedAt: string;
}

export interface TripSummary {
  tripId: string;
  itemCount: number;
  totalInr: number;
  destinations: string[];
  items: TripItem[];
}

export interface TripAddResult {
  tripId: string;
  itemId: string;
  productCode: string;
  title: string;
  travelDate: string;
  priceInr: number;
  status: string;
}

export interface TripBookResult {
  redirectUrl: string;
  clickId: string;
  tracked: boolean;
  productCode: string;
}

export interface TripEnquiryResult {
  leadId: string;
  tripId: string;
  itemCount: number;
  totalInr: number;
  status: string;
  message: string;
}
