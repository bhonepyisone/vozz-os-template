// FILE: src/app/(main)/attendance/page.jsx

'use client';

import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import QRCodeGenerator from '@/components/attendance/QRCodeGenerator';
import QRCodeScanner from '@/components/attendance/QRCodeScanner';
import LeaveRequestForm from '@/components/hrm/LeaveRequestForm';

export default function AttendancePage() {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();

  const canScan = user?.role === 'Admin' || user?.role === 'Front Desk';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('Attendance')}</h1>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {canScan ? <QRCodeScanner /> : <QRCodeGenerator />}
        </div>
        <div>
          <LeaveRequestForm />
        </div>
       </div>
    </div>
  );
}
