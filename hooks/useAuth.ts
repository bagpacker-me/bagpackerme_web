'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
  const isAdmin = !!user && (user.email === adminEmail || user.email === 'admin@bagpackerme.com');

  return { user, loading, isAdmin };
}
