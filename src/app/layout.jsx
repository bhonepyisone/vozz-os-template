// FILE: src/app/layout.jsx

import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider'; // Import the AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vozz OS - Restaurant Management',
  description: 'Complete SME Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire application with the AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}