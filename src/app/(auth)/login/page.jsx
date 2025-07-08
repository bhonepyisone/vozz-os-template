// FILE: src/app/(auth)/login/page.jsx

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

// FIX: Define helper components outside the main component function.
// This prevents them from being re-created on every render, which solves the focus issue.
const NeumorphismInput = (props) => (
  <input {...props} className="w-full my-2.5 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none" />
);

const NeumorphismButton = ({ children, ...props }) => (
  <button {...props} className="w-full mt-2.5 p-3 bg-neo-bg rounded-lg font-bold text-gray-700 shadow-neo-md transition-all hover:text-primary active:shadow-neo-inset disabled:opacity-50 flex items-center justify-center space-x-2">
    {children}
  </button>
);

export default function LoginPage() {
  // Login State
  const [staffId, setStaffId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError('');
    try {
      await login(staffId);
      router.push('/dashboard');
    } catch (err) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vozz OS Login</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your Staff ID to continue</p>
      </div>

      {/* Simplified Login Form */}
      <form onSubmit={handleLogin}>
        <NeumorphismInput
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        />
        {loginError && <p className="mt-2 text-xs text-red-500">{loginError}</p>}
        <NeumorphismButton type="submit" disabled={isLoginLoading}>
          <LogIn className="w-4 h-4"/>
          <span>{isLoginLoading ? 'Signing In...' : 'Login'}</span>
        </NeumorphismButton>
      </form>
    </>
  );
}
