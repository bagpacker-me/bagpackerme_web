'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { useField, type FieldAria, type UseFieldOptions } from './useField';

// Headless: these components own only the id/aria wiring via context and render
// no opinionated markup, so every existing className at the call sites stays
// byte-identical. This is an accessibility fix, not a restyle.

const FieldContext = createContext<(FieldAria & { error?: string; hint?: string }) | null>(null);

function useFieldContext() {
  const ctx = useContext(FieldContext);
  if (!ctx) throw new Error('Field subcomponents must be used inside <Field>');
  return ctx;
}

export function Field({
  className,
  children,
  ...options
}: UseFieldOptions & { className?: string; children: ReactNode }) {
  const aria = useField(options);
  return (
    <FieldContext.Provider value={{ ...aria, error: options.error, hint: options.hint }}>
      <div className={className}>{children}</div>
    </FieldContext.Provider>
  );
}

export function FieldLabel({ className, children }: { className?: string; children: ReactNode }) {
  const { labelProps } = useFieldContext();
  return (
    <label {...labelProps} className={className}>
      {children}
    </label>
  );
}

// For chip/button groups: a <span> label (a <label> would have no single
// associated control) plus a role="group" wrapper referencing it.
export function FieldGroupLabel({ className, children }: { className?: string; children: ReactNode }) {
  const { labelProps } = useFieldContext();
  return (
    <span id={labelProps.id} className={className}>
      {children}
    </span>
  );
}

export function FieldGroup({ className, children }: { className?: string; children: ReactNode }) {
  const { groupProps } = useFieldContext();
  return (
    <div {...groupProps} className={className}>
      {children}
    </div>
  );
}

// forwardRef is required: react-hook-form's register() returns a `ref` that gets
// spread here; a plain function component would warn and silently drop it,
// breaking setFocus/shouldFocusError. controlProps spread LAST so a register()
// spread can't clobber the generated id/aria.
export const FieldInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  function FieldInput(props, ref) {
    const { controlProps } = useFieldContext();
    return <input ref={ref} {...props} {...controlProps} />;
  }
);

export const FieldSelect = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<'select'>>(
  function FieldSelect(props, ref) {
    const { controlProps } = useFieldContext();
    return <select ref={ref} {...props} {...controlProps} />;
  }
);

export const FieldTextarea = forwardRef<HTMLTextAreaElement, ComponentPropsWithoutRef<'textarea'>>(
  function FieldTextarea(props, ref) {
    const { controlProps } = useFieldContext();
    return <textarea ref={ref} {...props} {...controlProps} />;
  }
);

export function FieldHint({ className }: { className?: string }) {
  const { hint, hintProps } = useFieldContext();
  if (!hint) return null;
  return (
    <p {...hintProps} className={className}>
      {hint}
    </p>
  );
}

// Fresh mount of an aria-live region is what makes the error announce. Polite,
// not assertive: the corporate form validates 26 fields at once, and assertive
// regions would talk over each other. The form-level error box uses role="alert".
export function FieldError({ className }: { className?: string }) {
  const { error, errorProps } = useFieldContext();
  if (!error) return null;
  return (
    <p {...errorProps} className={className} aria-live="polite">
      {error}
    </p>
  );
}
