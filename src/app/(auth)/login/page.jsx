// FILE: src/app/(auth)/login/page.jsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
// We will create the useAuthStore later in the `lib` folder
// import { useAuthStore } from '@/lib/auth'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const { login } = useAuthStore(); // This will be used later
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!staffId) {
      setError('Staff ID is required.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      // --- Placeholder for Firebase Login Logic ---
      // In a future step, we will replace this with a real call:
      // await login(staffId);
      
      // For now, we'll simulate a successful login
      console.log('Attempting to log in with Staff ID:', staffId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // On successful login, redirect to the dashboard
      router.push('/dashboard');

    } catch (err) {
      // If login fails, display an error
      setError('Login failed. Please check your Staff ID and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <Image 
          src="/assets/images/logo.png" // Make sure you have this placeholder image
          alt="Vozz OS Logo"
          width={80}
          height={80}
          className="mx-auto"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/6366f1/white?text=V'; }} // Fallback
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Vozz OS Login
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your credentials to proceed
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        <div>
          <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
            Staff ID
          </label>
          <div className="mt-1">
            <input
              id="staffId"
              name="staffId"
              type="text"
              required
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g., SHOP-12345"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
    </>
  );
}