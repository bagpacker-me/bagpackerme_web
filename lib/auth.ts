import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

export const loginAdmin = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  // Set session cookie for edge middleware auth checks
  document.cookie = `__session=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  return credential;
};

export const logoutAdmin = async () => {
  // Clear session cookie
  document.cookie = '__session=; path=/; max-age=0';
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, (user) => {
    // Keep session cookie in sync with Firebase auth state
    if (user) {
      document.cookie = `__session=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    } else {
      document.cookie = '__session=; path=/; max-age=0';
    }
    callback(user);
  });
