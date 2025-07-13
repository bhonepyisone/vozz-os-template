// FILE: src/app/(auth)/login/page.jsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

const NeumorphismInput = (props) => (
  <input {...props} className="w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none" />
);

const NeumorphismButton = ({ children, ...props }) => (
  <button {...props} className="w-full mt-2.5 p-3 bg-neo-bg rounded-lg font-bold text-gray-700 shadow-neo-md transition-all hover:text-primary active:shadow-neo-inset disabled:opacity-50 flex items-center justify-center space-x-2">
    {children}
  </button>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password, rememberMe);
      router.push('/dashboard');
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vozz OS Login</h1>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <NeumorphismInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <NeumorphismInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-sm text-gray-600">
                <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded shadow-neo-inset-active border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2">Remember Me</span>
            </label>
        </div>
        {error && <p className="text-xs text-red-500 pt-2">{error}</p>}
        <NeumorphismButton type="submit" disabled={isLoading}>
          <LogIn className="w-4 h-4"/>
          <span>{isLoading ? 'Signing In...' : 'Login'}</span>
        </NeumorphismButton>
      </form>
    </>
  );
}
