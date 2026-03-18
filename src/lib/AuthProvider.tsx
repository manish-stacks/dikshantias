'use client';

import { useEffect } from 'react';
import { useAuthStore } from './store/auth.store';

export default function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) {
    return <div>Loading authentication...</div>; // or nice skeleton
  }

  return null;
}