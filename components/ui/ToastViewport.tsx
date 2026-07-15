'use client';

import { Toaster } from 'react-hot-toast';

// Mounted once in the root layout. react-hot-toast renders nothing at all until a
// Toaster exists, so without this every toast.success/toast.error call in the app
// is a silent no-op — including the failure paths on all four enquiry forms.
//
// Anchored top-center: the bottom edge is already occupied by the floating
// WhatsApp button and the package-detail mobile price bar.
export function ToastViewport() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        className: 'font-body',
        style: {
          background: '#221E2A',
          color: '#FFFFFF',
          fontSize: '14px',
          lineHeight: '1.5',
          borderRadius: '12px',
          padding: '14px 18px',
          maxWidth: '440px',
          boxShadow: '0 12px 40px rgba(34, 30, 42, 0.28)',
        },
        success: {
          iconTheme: { primary: '#C1EA00', secondary: '#221E2A' },
        },
        error: {
          // Errors ask the user to act, so they need longer than a confirmation.
          duration: 8000,
          iconTheme: { primary: '#ef4444', secondary: '#FFFFFF' },
        },
      }}
    />
  );
}
