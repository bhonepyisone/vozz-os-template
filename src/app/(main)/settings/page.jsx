// FILE: src/app/(main)/settings/page.jsx

'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import UserProfileSettings from '@/components/settings/UserProfileSettings';
import ShopSettings from '@/components/settings/ShopSettings';
import ChangePassword from '@/components/settings/ChangePassword';
import SuccessModal from '@/components/ui/SuccessModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function SettingsPage() {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const canManageShop = user?.role === 'Admin' || user?.role === 'Management';
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('Settings')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UserProfileSettings onSuccess={setSuccessMessage} />
          {canManageShop && <ShopSettings onSuccess={setSuccessMessage} />}
          <ChangePassword onSuccess={setSuccessMessage} onError={setErrorMessage} />
        </div>
      </div>

      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title={t('Success')}
      >
        {successMessage}
      </SuccessModal>

      <ConfirmationModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage('')}
        onConfirm={() => setErrorMessage('')}
        title={t('Error')}
      >
        {errorMessage}
      </ConfirmationModal>
    </>
  );
}
