// FILE: src/app/page.jsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Ensure content is immediately visible so Vercel can prerender properly
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center">
      <div className="flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Initializing Vozz OS...</p>
      <p className="text-sm text-gray-500">
        {loading
          ? 'Please wait while we get things ready for you.'
          : user
          ? 'Redirecting to your dashboard...'
          : 'Redirecting to login...'}
      </p>
    </div>
  );
}
