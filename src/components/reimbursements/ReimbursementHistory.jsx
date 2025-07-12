// FILE: src/components/reimbursements/ReimbursementHistory.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';

const StatusBadge = ({ status }) => {
  const { t } = useTranslation('common');
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    denied: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full bg-neo-bg shadow-neo-md capitalize ${statusStyles[status] || 'bg-gray-100'}`}>
      {t(status)}
    </span>
  );
};

export default function ReimbursementHistory() {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'reimbursements'),
      where('staffId', '==', user.uid),
      orderBy('requestedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestedAt: doc.data().requestedAt.toDate(),
      }));
      setRequests(requestList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching reimbursement history:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Card title={t('YourReimbursementHistory')}>
      <div className="space-y-3">
        {isLoading && <p>Loading history...</p>}
        {!isLoading && requests.length === 0 && <p>You have not submitted any requests.</p>}
        {requests.map(req => (
          <div key={req.id} className="p-4 border border-neo-dark/20 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">{req.reason}</p>
              <p className="text-sm text-gray-600">{t('Amount')}: {req.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-400">{t('Submitted')}: {formatDate(req.requestedAt)}</p>
            </div>
            <StatusBadge status={req.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
