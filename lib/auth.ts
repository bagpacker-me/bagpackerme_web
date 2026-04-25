import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getConfiguredAdminEmail, isAdminEmail } from './admin';

function syncSessionCookies(email?: string | null) {
  if (typeof document === 'undefined') {
    return;
  }

  if (email && isAdminEmail(email)) {
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `__session=1; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `__session_email=${encodeURIComponent(email.toLowerCase())}; path=/; max-age=${maxAge}; SameSite=Lax`;
    return;
  }

  document.cookie = '__session=; path=/; max-age=0';
  document.cookie = '__session_email=; path=/; max-age=0';
}

export const loginAdmin = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  if (!isAdminEmail(credential.user.email)) {
    syncSessionCookies(null);
    await signOut(auth);
    throw new Error(`Only ${getConfiguredAdminEmail()} can access the admin dashboard.`);
  }

  syncSessionCookies(credential.user.email);
  return credential;
};

export const logoutAdmin = async () => {
  syncSessionCookies(null);
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, (user) => {
    syncSessionCookies(user?.email ?? null);
    callback(user);
  });
