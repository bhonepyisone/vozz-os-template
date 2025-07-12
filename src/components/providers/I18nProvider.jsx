// FILE: src/components/providers/I18nProvider.jsx

'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// This component wraps our app and provides the i18n instance to it.
// It also shows a loading fallback while translations are being loaded.
export default function I18nProvider({ children }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Suspense>
  );
}
