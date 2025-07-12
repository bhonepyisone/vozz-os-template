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
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith('/login');
    const isAdminPage = pathname.startsWith('/admin');

    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user) {
      if (isAuthPage) {
        router.push('/dashboard');
      } else if (isAdminPage && user.role !== 'Admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neo-bg">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return children;
}
