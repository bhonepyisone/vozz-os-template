// FILE: src/app/(main)/reimbursements/page.jsx

'use client';

import { useState } from 'react';
import ReimbursementForm from '@/components/reimbursements/ReimbursementForm';
import ReimbursementHistory from '@/components/reimbursements/ReimbursementHistory';
import SuccessModal from '@/components/ui/SuccessModal'; // Import the themed modal

export default function ReimbursementsPage() {
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>Expense Reimbursements</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {/* Pass the state-setting function to the form */}
            <ReimbursementForm onSuccess={setSuccessMessage} />
          </div>
          <div className="lg:col-span-2">
            <ReimbursementHistory />
          </div>
        </div>
      </div>

      {/* Render the themed modal */}
      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title="Success!"
      >
        {successMessage}
      </SuccessModal>
    </>
  );
}
