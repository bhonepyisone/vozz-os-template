// FILE: src/app/layout.jsx

import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import I18nProvider from '@/components/providers/I18nProvider'; // Import the new provider

export const metadata = {
  title: 'Vozz OS - Restaurant Management',
  description: 'Complete SME Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/images/logo.png" type="image/png" />
      </head>
      <body>
        <I18nProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
