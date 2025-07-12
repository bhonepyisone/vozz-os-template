// FILE: src/app/(main)/reimbursements/page.jsx

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReimbursementForm from '@/components/reimbursements/ReimbursementForm';
import ReimbursementHistory from '@/components/reimbursements/ReimbursementHistory';
import SuccessModal from '@/components/ui/SuccessModal';

export default function ReimbursementsPage() {
  const { t } = useTranslation('common');
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('Reimbursements')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ReimbursementForm onSuccess={setSuccessMessage} />
          </div>
          <div className="lg:col-span-2">
            <ReimbursementHistory />
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title={t('Success')}
      >
        {t(successMessage.key || successMessage, successMessage.options)}
      </SuccessModal>
    </>
  );
}
