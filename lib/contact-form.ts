import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  inquiryType: z.enum(
    ['Group Trip', 'Personalised Itinerary', 'Corporate Retreat', 'Media & Partnership', 'Other'] as const,
    { error: 'Please select an inquiry type' }
  ),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
