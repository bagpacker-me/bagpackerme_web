import { z } from 'zod';

export const packageBookingSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits'),
  travelDate: z.string().trim().min(1, 'Please select a preferred date'),
  groupSize: z.coerce.number().int().positive('Group size must be at least 1'),
  message: z.string().trim().optional(),
  packageSlug: z.string().trim().min(1, 'Package slug is required'),
  packageTitle: z.string().trim().min(1, 'Package title is required'),
});

export type PackageBookingData = z.infer<typeof packageBookingSchema>;
