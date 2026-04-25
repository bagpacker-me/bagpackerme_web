import type { ContactIntent } from '@/lib/inquiry-form';

export function normalizeContactIntent(value?: string | null): ContactIntent | null {
  if (value === 'trip' || value === 'corporate' || value === 'general') {
    return value;
  }

  return null;
}
