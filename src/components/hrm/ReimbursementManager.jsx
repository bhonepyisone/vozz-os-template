// FILE: src/components/hrm/ReimbursementManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Check, X, DollarSign } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import ExportButton from '@/components/ui/ExportButton';

export default function ReimbursementManager({ setConfirmState, setSuccessMessage }) {
  const { t } = useTranslation('common');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reimbursements'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(requestList);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleActionClick = (request, status) => {
    setConfirmState({
      isOpen: true,
      title: 'ConfirmAction',
      message: 'ConfirmReimbursementRequest',
      options: { action: t(status), status: t(status) },
      onConfirm: async () => {
        const requestRef = doc(db, 'reimbursements', request.id);
        await updateDoc(requestRef, { status: status });
        setSuccessMessage({ key: 'ReimbursementRequestProcessed', options: { status: t(status) } });
        setConfirmState({ isOpen: false });
      }
    });
  };

  const csvHeaders = [
    { label: "Request ID", key: "id" },
    { label: "Staff Name", key: "staffName" },
    { label: "Amount", key: "amount" },
    { label: "Reason", key: "reason" },
    { label: "Date", key: "requestedAt" },
  ];

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">{t('PendingReimbursements')}</h2>
            <ExportButton data={requests} headers={csvHeaders} filename="pending_reimbursements.csv">
              {t('ExportToCSV')}
            </ExportButton>
        </div>
      <div className="space-y-4">
        {isLoading && <p>Loading requests...</p>}
        {!isLoading && requests.length === 0 ? (
          <p className="text-center text-gray-500 py-4">{t('NoPendingReimbursements')}</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="p-4 border border-neo-dark/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{req.staffName}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1"/> {t('Amount')}: <span className="font-medium ml-1">{req.amount.toFixed(2)}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <NeumorphismButton onClick={() => handleActionClick(req, 'approved')} className="!w-auto !p-2 !rounded-full !text-green-600">
                    <Check className="w-5 h-5" />
                  </NeumorphismButton>
                  <NeumorphismButton onClick={() => handleActionClick(req, 'denied')} className="!w-auto !p-2 !rounded-full !text-red-600">
                    <X className="w-5 h-5" />
                  </NeumorphismButton>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">{t('ReasonForExpense')}: {req.reason}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
