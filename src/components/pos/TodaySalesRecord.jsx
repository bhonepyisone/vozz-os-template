// FILE: src/components/pos/TodaySalesRecord.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { formatDate } from '@/lib/utils';

export default function TodaySalesRecord() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = Timestamp.fromDate(startOfToday);

    const salesRef = collection(db, 'sales');
    const q = query(salesRef, where('createdAt', '>=', startTimestamp));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      setSales(salesList.sort((a, b) => b.createdAt - a.createdAt));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Today&apos;s Sales</h2>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {isLoading && <p>Loading sales...</p>}
        {!isLoading && sales.length === 0 && <p>No sales recorded yet today.</p>}
        {sales.map(sale => (
          <div key={sale.id} className="p-3 border rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{sale.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{formatDate(sale.createdAt, 'p')}</p>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {sale.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
