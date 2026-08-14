// Shared, framework-free validation helpers for the hand-rolled forms
// (lib/inquiry-form.ts, lib/club-application.ts). The react-hook-form + zod
// forms — contact, careers — do not need these; they get the same checks from
// their schemas.

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function hasValue(value: string | string[] | boolean) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return value;
  return value.trim().length > 0;
}

// Deliberately loose: this is a "did you fumble the paste" check, not an E.164
// parse. Indian mobiles, +country prefixes and spaced formats all pass.
export function phoneLooksValid(value: string) {
  return value.replace(/\D/g, '').length >= 8;
}

export function requireField<T extends object>(
  errors: FormErrors<T>,
  field: keyof T,
  value: string | string[] | boolean,
  message: string
) {
  if (!hasValue(value)) {
    errors[field] = message;
  }
}
