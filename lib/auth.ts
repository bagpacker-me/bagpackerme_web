import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getConfiguredAdminEmail, isAdminEmail } from './admin';

async function createSessionCookie(user: User) {
  const idToken = await user.getIdToken();
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: null }));
    throw new Error(error || 'Could not start an admin session.');
  }
}

async function clearSessionCookie() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch {
    // Signing out locally matters more than clearing the cookie; middleware
    // rejects an orphaned cookie on the next request regardless.
  }
}

export const loginAdmin = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  if (!isAdminEmail(credential.user.email)) {
    await signOut(auth);
    throw new Error(`Only ${getConfiguredAdminEmail()} can access the admin dashboard.`);
  }

  // The server re-verifies the ID token and re-checks the email before issuing
  // the cookie; this client-side check only produces a clearer error message.
  try {
    await createSessionCookie(credential.user);
  } catch (err) {
    await signOut(auth);
    throw err;
  }

  return credential;
};

export const logoutAdmin = async () => {
  await clearSessionCookie();
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
