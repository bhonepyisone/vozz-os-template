// FILE: src/components/providers/AuthProvider.jsx

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthProvider({ children }) {
  const { user, loading, fetchUser } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // When the app loads, try to fetch the user's session
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const isAuthPage = pathname.startsWith('/login');
    const isAdminPage = pathname.startsWith('/admin');

    if (!user && !isAuthPage) {
      // If not logged in and not on an auth page, redirect to login
      router.push('/login');
    } else if (user) {
      if (isAuthPage) {
        // If logged in and on an auth page, redirect to dashboard
        router.push('/dashboard');
      } else if (isAdminPage && user.role !== 'Admin') {
        // If a non-admin tries to access an admin page, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return children;
}
