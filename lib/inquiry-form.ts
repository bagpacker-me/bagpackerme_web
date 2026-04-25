import type { Enquiry, EnquiryFormData } from '@/types';

export type InquiryVariant = 'b2c' | 'corporate';

export interface InquiryOption {
  label: string;
  value: string;
}

export interface B2CFormState {
  fullName: string;
  email: string;
  phone: string;
  destinationMode: string;
  destinationName: string;
  tripType: string;
  duration: string;
  tripVibe: string[];
  travelers: string;
  travelMonth: string;
  note: string;
}

export type CorporateStepId =
  | 'overview'
  | 'attendees'
  | 'stay-travel'
  | 'meetings-av'
  | 'food-social'
  | 'activities'
  | 'budget-contact';

export interface CorporateFormState {
  companyName: string;
  retreatType: string;
  primaryGoal: string;
  destinationMode: string;
  destinationName: string;
  attendeeCount: string;
  attendeeProfile: string;
  roomingStyle: string;
  preferredMonth: string;
  duration: string;
  originCities: string;
  accommodationStyle: string;
  transfersSupport: string;
  meetingSetup: string;
  avRequirements: string[];
  sessionNotes: string;
  mealStyle: string;
  dietaryRequirements: string;
  socialPlans: string[];
  activityTypes: string[];
  activityNotes: string;
  budgetRange: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  extraNotes: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export const B2C_DESTINATION_OPTIONS: InquiryOption[] = [
  { label: 'I have a destination in mind', value: 'I have a destination in mind' },
  { label: 'Open to suggestions', value: 'Open to suggestions' },
];

export const B2C_TRIP_TYPE_OPTIONS: InquiryOption[] = [
  { label: 'Adventure escape', value: 'Adventure escape' },
  { label: 'Cultural immersion', value: 'Cultural immersion' },
  { label: 'Food journey', value: 'Food journey' },
  { label: 'Wellness break', value: 'Wellness break' },
  { label: 'Celebration trip', value: 'Celebration trip' },
];

export const B2C_DURATION_OPTIONS: InquiryOption[] = [
  { label: 'Weekend escape', value: 'Weekend escape' },
  { label: '3 to 5 days', value: '3 to 5 days' },
  { label: '6 to 8 days', value: '6 to 8 days' },
  { label: '9+ days', value: '9+ days' },
];

export const B2C_TRIP_VIBE_OPTIONS: InquiryOption[] = [
  { label: 'Culture', value: 'Culture' },
  { label: 'Food', value: 'Food' },
  { label: 'Nature', value: 'Nature' },
  { label: 'Adventure', value: 'Adventure' },
  { label: 'Wellness', value: 'Wellness' },
  { label: 'Luxury', value: 'Luxury' },
  { label: 'Slow travel', value: 'Slow travel' },
];

export const B2C_TRAVELER_OPTIONS: InquiryOption[] = [
  { label: '1 traveler', value: '1 traveler' },
  { label: '2 travelers', value: '2 travelers' },
  { label: '3 to 4 travelers', value: '3 to 4 travelers' },
  { label: '5 to 8 travelers', value: '5 to 8 travelers' },
  { label: '9+ travelers', value: '9+ travelers' },
];

export const CORPORATE_STEPS: { id: CorporateStepId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'attendees', label: 'Attendees' },
  { id: 'stay-travel', label: 'Stay & Travel' },
  { id: 'meetings-av', label: 'Meetings & AV' },
  { id: 'food-social', label: 'Food & Social' },
  { id: 'activities', label: 'Activities' },
  { id: 'budget-contact', label: 'Budget & Contact' },
];

export const CORPORATE_RETREAT_TYPE_OPTIONS: InquiryOption[] = [
  { label: 'Team retreat', value: 'Team retreat' },
  { label: 'Offsite', value: 'Offsite' },
  { label: 'Leadership summit', value: 'Leadership summit' },
  { label: 'Incentive trip', value: 'Incentive trip' },
  { label: 'Workation', value: 'Workation' },
  { label: 'Conference / MICE', value: 'Conference / MICE' },
];

export const CORPORATE_ATTENDEE_OPTIONS: InquiryOption[] = [
  { label: '10 to 25', value: '10 to 25' },
  { label: '26 to 50', value: '26 to 50' },
  { label: '51 to 100', value: '51 to 100' },
  { label: '101 to 250', value: '101 to 250' },
  { label: '250+', value: '250+' },
];

export const CORPORATE_ROOMING_OPTIONS: InquiryOption[] = [
  { label: 'Mostly single rooms', value: 'Mostly single rooms' },
  { label: 'Mostly twin share', value: 'Mostly twin share' },
  { label: 'A mix of both', value: 'A mix of both' },
];

export const CORPORATE_DURATION_OPTIONS: InquiryOption[] = [
  { label: '1 night / 2 days', value: '1 night / 2 days' },
  { label: '2 nights / 3 days', value: '2 nights / 3 days' },
  { label: '3 nights / 4 days', value: '3 nights / 4 days' },
  { label: '4+ nights', value: '4+ nights' },
];

export const CORPORATE_ACCOMMODATION_OPTIONS: InquiryOption[] = [
  { label: 'Boutique hotels', value: 'Boutique hotels' },
  { label: 'Premium resorts', value: 'Premium resorts' },
  { label: 'Heritage stays', value: 'Heritage stays' },
  { label: 'Nature lodges', value: 'Nature lodges' },
  { label: 'Open to suggestions', value: 'Open to suggestions' },
];

export const CORPORATE_TRANSFER_OPTIONS: InquiryOption[] = [
  { label: 'Yes, end-to-end support', value: 'Yes, end-to-end support' },
  { label: 'Only airport / station transfers', value: 'Only airport / station transfers' },
  { label: 'No, not needed', value: 'No, not needed' },
  { label: 'Not sure yet', value: 'Not sure yet' },
];

export const CORPORATE_MEETING_SETUP_OPTIONS: InquiryOption[] = [
  { label: 'No formal meeting space', value: 'No formal meeting space' },
  { label: 'Plenary room only', value: 'Plenary room only' },
  { label: 'Plenary + breakout rooms', value: 'Plenary + breakout rooms' },
  { label: 'Workshop-style setup', value: 'Workshop-style setup' },
];

export const CORPORATE_AV_OPTIONS: InquiryOption[] = [
  { label: 'No special AV needs', value: 'No special AV needs' },
  { label: 'Projector / screen', value: 'Projector / screen' },
  { label: 'Handheld mics', value: 'Handheld mics' },
  { label: 'Conference speaker setup', value: 'Conference speaker setup' },
  { label: 'Hybrid / streaming support', value: 'Hybrid / streaming support' },
  { label: 'Recording / photography', value: 'Recording / photography' },
];

export const CORPORATE_MEAL_STYLE_OPTIONS: InquiryOption[] = [
  { label: 'Mostly vegetarian', value: 'Mostly vegetarian' },
  { label: 'Mixed menus', value: 'Mixed menus' },
  { label: 'Wellness-focused menus', value: 'Wellness-focused menus' },
  { label: 'Celebration dining', value: 'Celebration dining' },
  { label: 'Need guidance', value: 'Need guidance' },
];

export const CORPORATE_SOCIAL_PLAN_OPTIONS: InquiryOption[] = [
  { label: 'No social event needed', value: 'No social event needed' },
  { label: 'Welcome dinner', value: 'Welcome dinner' },
  { label: 'Awards / recognition night', value: 'Awards / recognition night' },
  { label: 'Sundowner or rooftop evening', value: 'Sundowner or rooftop evening' },
  { label: 'Local cultural evening', value: 'Local cultural evening' },
  { label: 'Team celebration party', value: 'Team celebration party' },
];

export const CORPORATE_ACTIVITY_OPTIONS: InquiryOption[] = [
  { label: 'No planned activities', value: 'No planned activities' },
  { label: 'Team building', value: 'Team building' },
  { label: 'Adventure', value: 'Adventure' },
  { label: 'Wellness', value: 'Wellness' },
  { label: 'Culture', value: 'Culture' },
  { label: 'CSR / volunteering', value: 'CSR / volunteering' },
  { label: 'Nature and downtime', value: 'Nature and downtime' },
];

export const CORPORATE_BUDGET_OPTIONS: InquiryOption[] = [
  { label: 'Under INR 5L', value: 'Under INR 5L' },
  { label: 'INR 5L to 10L', value: 'INR 5L to 10L' },
  { label: 'INR 10L to 20L', value: 'INR 10L to 20L' },
  { label: 'INR 20L+', value: 'INR 20L+' },
  { label: 'Need guidance', value: 'Need guidance' },
];

export const initialB2CFormState: B2CFormState = {
  fullName: '',
  email: '',
  phone: '',
  destinationMode: '',
  destinationName: '',
  tripType: '',
  duration: '',
  tripVibe: [],
  travelers: '',
  travelMonth: '',
  note: '',
};

export const initialCorporateFormState: CorporateFormState = {
  companyName: '',
  retreatType: '',
  primaryGoal: '',
  destinationMode: '',
  destinationName: '',
  attendeeCount: '',
  attendeeProfile: '',
  roomingStyle: '',
  preferredMonth: '',
  duration: '',
  originCities: '',
  accommodationStyle: '',
  transfersSupport: '',
  meetingSetup: '',
  avRequirements: [],
  sessionNotes: '',
  mealStyle: '',
  dietaryRequirements: '',
  socialPlans: [],
  activityTypes: [],
  activityNotes: '',
  budgetRange: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  extraNotes: '',
};

export const CORPORATE_STEP_FIELDS: Record<CorporateStepId, (keyof CorporateFormState)[]> = {
  overview: ['companyName', 'retreatType', 'primaryGoal', 'destinationMode', 'destinationName'],
  attendees: ['attendeeCount', 'attendeeProfile', 'roomingStyle'],
  'stay-travel': ['preferredMonth', 'duration', 'originCities', 'accommodationStyle', 'transfersSupport'],
  'meetings-av': ['meetingSetup', 'avRequirements', 'sessionNotes'],
  'food-social': ['mealStyle', 'dietaryRequirements', 'socialPlans'],
  activities: ['activityTypes', 'activityNotes'],
  'budget-contact': ['budgetRange', 'contactName', 'contactEmail', 'contactPhone', 'extraNotes'],
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasValue(value: string | string[]) {
  return Array.isArray(value) ? value.length > 0 : value.trim().length > 0;
}

function phoneLooksValid(value: string) {
  return value.replace(/\D/g, '').length >= 8;
}

function safeText(value: string, fallback = 'Not specified') {
  return value.trim() || fallback;
}

function safeList(values: string[], fallback = 'Not specified') {
  return values.length ? values.join(', ') : fallback;
}

function requireField<T extends object>(
  errors: FormErrors<T>,
  field: keyof T,
  value: string | string[],
  message: string
) {
  if (!hasValue(value)) {
    errors[field] = message;
  }
}

export function validateB2CForm(form: B2CFormState): FormErrors<B2CFormState> {
  const errors: FormErrors<B2CFormState> = {};

  requireField(errors, 'fullName', form.fullName, 'Full name is required');
  requireField(errors, 'email', form.email, 'Email is required');
  requireField(errors, 'phone', form.phone, 'Phone / WhatsApp is required');
  requireField(errors, 'destinationMode', form.destinationMode, 'Choose how you want to decide the destination');
  requireField(errors, 'tripType', form.tripType, 'Select a trip type');
  requireField(errors, 'duration', form.duration, 'Select a duration');
  requireField(errors, 'tripVibe', form.tripVibe, 'Choose at least one trip vibe');
  requireField(errors, 'travelers', form.travelers, 'Choose a traveler count');
  requireField(errors, 'travelMonth', form.travelMonth, 'Choose your preferred travel month');

  if (form.destinationMode === 'I have a destination in mind') {
    requireField(errors, 'destinationName', form.destinationName, 'Destination name is required');
  }

  if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (form.phone.trim() && !phoneLooksValid(form.phone)) {
    errors.phone = 'Enter a valid phone / WhatsApp number';
  }

  return errors;
}

export function validateCorporateForm(form: CorporateFormState): FormErrors<CorporateFormState> {
  const errors: FormErrors<CorporateFormState> = {};

  requireField(errors, 'companyName', form.companyName, 'Company or organization name is required');
  requireField(errors, 'retreatType', form.retreatType, 'Choose a retreat format');
  requireField(errors, 'primaryGoal', form.primaryGoal, 'Tell us the primary goal');
  requireField(errors, 'destinationMode', form.destinationMode, 'Choose how you want to decide the destination');

  if (form.destinationMode === 'I have a destination in mind') {
    requireField(errors, 'destinationName', form.destinationName, 'Destination name is required');
  }

  requireField(errors, 'attendeeCount', form.attendeeCount, 'Select the attendee count');
  requireField(errors, 'attendeeProfile', form.attendeeProfile, 'Describe the attendee profile');
  requireField(errors, 'roomingStyle', form.roomingStyle, 'Choose a rooming style');

  requireField(errors, 'preferredMonth', form.preferredMonth, 'Preferred travel month is required');
  requireField(errors, 'duration', form.duration, 'Select the stay duration');
  requireField(errors, 'originCities', form.originCities, 'Departure city or cities are required');
  requireField(errors, 'accommodationStyle', form.accommodationStyle, 'Choose an accommodation style');
  requireField(errors, 'transfersSupport', form.transfersSupport, 'Choose the transfer support needed');

  requireField(errors, 'meetingSetup', form.meetingSetup, 'Choose the meeting setup');
  requireField(errors, 'avRequirements', form.avRequirements, 'Choose at least one AV option');

  requireField(errors, 'mealStyle', form.mealStyle, 'Choose a food style');
  requireField(errors, 'socialPlans', form.socialPlans, 'Choose at least one social plan');

  requireField(errors, 'activityTypes', form.activityTypes, 'Choose at least one activity preference');

  requireField(errors, 'budgetRange', form.budgetRange, 'Choose a budget range');
  requireField(errors, 'contactName', form.contactName, 'Contact name is required');
  requireField(errors, 'contactEmail', form.contactEmail, 'Work email is required');
  requireField(errors, 'contactPhone', form.contactPhone, 'Phone / WhatsApp is required');

  if (form.contactEmail.trim() && !EMAIL_PATTERN.test(form.contactEmail.trim())) {
    errors.contactEmail = 'Enter a valid work email address';
  }

  if (form.contactPhone.trim() && !phoneLooksValid(form.contactPhone)) {
    errors.contactPhone = 'Enter a valid phone / WhatsApp number';
  }

  return errors;
}

export function getCorporateStepErrors(
  form: CorporateFormState,
  stepId: CorporateStepId
): FormErrors<CorporateFormState> {
  const allErrors = validateCorporateForm(form);
  const stepErrors: FormErrors<CorporateFormState> = {};

  for (const field of CORPORATE_STEP_FIELDS[stepId]) {
    if (allErrors[field]) {
      stepErrors[field] = allErrors[field];
    }
  }

  return stepErrors;
}

export function buildB2CWhatsAppMessage(form: B2CFormState) {
  const destinationText =
    form.destinationMode === 'I have a destination in mind' && form.destinationName.trim()
      ? form.destinationName.trim()
      : 'open to suggestions';

  const lines = [
    "Hi BagPackerMe! I'd love help planning a trip.",
    '',
    `Name: ${form.fullName.trim()}`,
    `Email: ${form.email.trim()}`,
    `Phone / WhatsApp: ${form.phone.trim()}`,
    `Destination: ${destinationText}`,
    `Trip type: ${form.tripType}`,
    `Duration: ${form.duration}`,
    `Trip vibe: ${form.tripVibe.join(', ')}`,
    `Travelers: ${form.travelers}`,
    `Preferred travel month: ${form.travelMonth}`,
  ];

  if (form.note.trim()) {
    lines.push('', `Note: ${form.note.trim()}`);
  }

  return lines.join('\n');
}

export function buildCorporateWhatsAppMessage(form: CorporateFormState) {
  const destinationText =
    form.destinationMode === 'I have a destination in mind'
      ? safeText(form.destinationName)
      : 'Open to suggestions';

  return [
    "Hi BagPackerMe! We'd like to plan a corporate retreat / MICE experience.",
    '',
    `Company / organization: ${form.companyName.trim()}`,
    `Retreat format: ${form.retreatType}`,
    `Primary goal: ${form.primaryGoal.trim()}`,
    `Destination: ${destinationText}`,
    `Attendees: ${form.attendeeCount}`,
    `Attendee profile: ${form.attendeeProfile.trim()}`,
    `Rooming style: ${form.roomingStyle}`,
    `Preferred travel month: ${form.preferredMonth}`,
    `Duration: ${form.duration}`,
    `Departure city / cities: ${form.originCities.trim()}`,
    `Accommodation style: ${form.accommodationStyle}`,
    `Transfers support: ${form.transfersSupport}`,
    `Meeting setup: ${form.meetingSetup}`,
    `AV requirements: ${safeList(form.avRequirements)}`,
    `Session notes: ${safeText(form.sessionNotes)}`,
    `Food style: ${form.mealStyle}`,
    `Dietary requirements: ${safeText(form.dietaryRequirements)}`,
    `Social plans: ${safeList(form.socialPlans)}`,
    `Activities: ${safeList(form.activityTypes)}`,
    `Activity notes: ${safeText(form.activityNotes)}`,
    `Budget range: ${form.budgetRange}`,
    `Contact name: ${form.contactName.trim()}`,
    `Work email: ${form.contactEmail.trim()}`,
    `Phone / WhatsApp: ${form.contactPhone.trim()}`,
    `Extra notes: ${safeText(form.extraNotes)}`,
  ].join('\n');
}

export function buildB2CEnquiryPayload(
  form: B2CFormState,
  affiliateCode?: string | null
): Omit<Enquiry, 'id'> {
  const destinationName =
    form.destinationMode === 'I have a destination in mind' ? form.destinationName.trim() : '';
  const formData: EnquiryFormData = {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    destinationMode: form.destinationMode,
    destinationName,
    tripType: form.tripType,
    duration: form.duration,
    tripVibe: form.tripVibe,
    travelers: form.travelers,
    travelMonth: form.travelMonth,
    note: form.note.trim(),
  };

  return {
    name: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    inquiryType: 'Trip Inquiry',
    message: buildB2CWhatsAppMessage(form),
    status: 'new',
    source: 'book-page',
    submittedVia: 'whatsapp-handoff',
    formVariant: 'b2c',
    formData,
    ...(affiliateCode ? { affiliateCode } : {}),
    createdAt: new Date().toISOString(),
  };
}

export function buildCorporateEnquiryPayload(
  form: CorporateFormState,
  affiliateCode?: string | null
): Omit<Enquiry, 'id'> {
  const destinationName =
    form.destinationMode === 'I have a destination in mind' ? form.destinationName.trim() : '';
  const formData: EnquiryFormData = {
    companyName: form.companyName.trim(),
    retreatType: form.retreatType,
    primaryGoal: form.primaryGoal.trim(),
    destinationMode: form.destinationMode,
    destinationName,
    attendeeCount: form.attendeeCount,
    attendeeProfile: form.attendeeProfile.trim(),
    roomingStyle: form.roomingStyle,
    preferredMonth: form.preferredMonth,
    duration: form.duration,
    originCities: form.originCities.trim(),
    accommodationStyle: form.accommodationStyle,
    transfersSupport: form.transfersSupport,
    meetingSetup: form.meetingSetup,
    avRequirements: form.avRequirements,
    sessionNotes: form.sessionNotes.trim(),
    mealStyle: form.mealStyle,
    dietaryRequirements: form.dietaryRequirements.trim(),
    socialPlans: form.socialPlans,
    activityTypes: form.activityTypes,
    activityNotes: form.activityNotes.trim(),
    budgetRange: form.budgetRange,
    contactName: form.contactName.trim(),
    contactEmail: form.contactEmail.trim(),
    contactPhone: form.contactPhone.trim(),
    extraNotes: form.extraNotes.trim(),
  };

  return {
    name: form.contactName.trim(),
    email: form.contactEmail.trim(),
    phone: form.contactPhone.trim(),
    inquiryType: 'Corporate Retreat Inquiry',
    message: buildCorporateWhatsAppMessage(form),
    status: 'new',
    source: 'corporate-page',
    submittedVia: 'whatsapp-handoff',
    formVariant: 'corporate',
    formData,
    ...(affiliateCode ? { affiliateCode } : {}),
    createdAt: new Date().toISOString(),
  };
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
