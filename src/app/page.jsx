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
    // This effect will run when the component mounts and whenever the user or loading state changes.
    if (!loading) {
      if (user) {
        // If the user is logged in, redirect to the dashboard.
        router.push('/dashboard');
      } else {
        // If no user is logged in, redirect to the login page.
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Display a loader while the authentication check is in progress.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center">
      <div className="flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Initializing Vozz OS...</p>
      <p className="text-sm text-gray-500">Please wait while we get things ready for you.</p>
    </div>
  );
}
