// FILE: src/components/hrm/LeaveManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import ExportButton from '@/components/ui/ExportButton';

export default function LeaveManager({ setConfirmState, setSuccessMessage }) {
  const { t } = useTranslation('common');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'leave_requests'), where('status', '==', 'pending'));
    
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
      message: 'ConfirmLeaveRequest',
      options: { action: t(status), status: t(status) },
      onConfirm: async () => {
        const requestRef = doc(db, 'leave_requests', request.id);
        await updateDoc(requestRef, { status: status });

        if (status === 'approved') {
          await addDoc(collection(db, 'attendance'), {
            staffId: request.staffId,
            scannedAt: request.startDate,
            type: request.leaveType,
            details: `Approved leave from ${formatDate(request.startDate.toDate())} to ${formatDate(request.endDate.toDate())}`
          });
        }
        setSuccessMessage({ key: 'LeaveRequestProcessed', options: { status: t(status) } });
        setConfirmState({ isOpen: false });
      }
    });
  };

  const csvHeaders = [
      { label: t('RequestID'), key: "id" },
      { label: t('StaffName'), key: "staffName" },
      { label: t('LeaveType'), key: "leaveType" },
      { label: t('StartDate'), key: "startDate" },
      { label: t('EndDate'), key: "endDate" },
      { label: t('Reason'), key: "reason" },
  ];

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">{t('PendingLeaveRequests')}</h2>
            <ExportButton data={requests} headers={csvHeaders} filename="pending_leave_requests.csv">
              {t('ExportToCSV')}
            </ExportButton>
        </div>
      <div className="space-y-4">
        {isLoading && <p>Loading requests...</p>}
        {!isLoading && requests.length === 0 ? (
          <p className="text-center text-gray-500 py-4">{t('NoPendingLeave')}</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="p-4 border border-neo-dark/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{req.staffName}</p>
                  <p className="text-sm text-gray-600">{req.leaveType}: 
                    <span className="font-medium"> {formatDate(req.startDate.toDate())} to {formatDate(req.endDate.toDate())}</span>
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
              {req.reason && <p className="text-xs text-gray-500 mt-2 italic">{t('Reason')}: {req.reason}</p>}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
