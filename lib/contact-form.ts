import { z } from 'zod';

export const CONTACT_INQUIRY_TYPE_OPTIONS = [
  'Group Trip',
  'Personalised Itinerary',
  'Corporate Retreat',
  'Media & Partnership',
  'Other',
] as const;

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  inquiryType: z.enum(CONTACT_INQUIRY_TYPE_OPTIONS, { error: 'Please select an inquiry type' }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function buildContactWhatsAppMessage(data: ContactFormData) {
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  return [
    'Hi BagPackerMe! I just sent a general enquiry through your contact page.',
    '',
    `Name: ${fullName}`,
    `Email: ${data.email.trim()}`,
    `Phone / WhatsApp: ${data.phone.trim()}`,
    `Inquiry type: ${data.inquiryType}`,
    '',
    `Message: ${data.message.trim()}`,
  ].join('\n');
}
