const DEFAULT_ADMIN_EMAIL = 'bagpackerme.world@gmail.com';

export function getConfiguredAdminEmail() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

export function isAdminEmail(email?: string | null) {
  return !!email && email.toLowerCase() === getConfiguredAdminEmail();
}
