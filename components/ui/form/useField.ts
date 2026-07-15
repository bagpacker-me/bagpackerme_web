'use client';

import { useId } from 'react';

export interface UseFieldOptions {
  error?: string; // presence flips aria-invalid and mounts the alert
  hint?: string;
  required?: boolean;
  id?: string; // override for anchor targets; otherwise auto
}

export interface FieldAria {
  id: string;
  hasError: boolean;
  labelProps: { id: string; htmlFor: string };
  controlProps: {
    id: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
    'aria-required'?: true;
  };
  groupProps: { role: 'group'; 'aria-labelledby': string; 'aria-describedby'?: string };
  hintProps: { id: string };
  errorProps: { id: string };
}

export function useField(options?: UseFieldOptions): FieldAria {
  // React's useId returns ":r0:" — colons are legal in HTML ids but break
  // querySelector('#:r0:') without escaping, which breaks tests. Strip them.
  const rawId = useId();
  const id = options?.id ?? `bpm-${rawId.replace(/:/g, '')}`;
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const hasError = Boolean(options?.error);
  const hasHint = Boolean(options?.hint);

  // Order matters: screen readers announce describedby in listed order, so hint
  // before error.
  const describedBy = [hasHint ? hintId : null, hasError ? errorId : null]
    .filter(Boolean)
    .join(' ');
  const describedByProp = describedBy ? { 'aria-describedby': describedBy } : {};

  // aria-required, not the real `required` attribute: BookingForm doesn't set
  // noValidate, so a real `required` would trigger native validation bubbles
  // that fight the zod resolver. This conveys the semantics without the behavior.
  const requiredProp = options?.required ? { 'aria-required': true as const } : {};
  const invalidProp = hasError ? { 'aria-invalid': true as const } : {};

  return {
    id,
    hasError,
    labelProps: { id: labelId, htmlFor: id },
    controlProps: { id, ...invalidProp, ...describedByProp, ...requiredProp },
    groupProps: { role: 'group', 'aria-labelledby': labelId, ...describedByProp },
    hintProps: { id: hintId },
    errorProps: { id: errorId },
  };
}
