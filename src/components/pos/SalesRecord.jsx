// FILE: src/components/pos/SalesRecord.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { formatDate } from '@/lib/utils';
import { endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Banknote, CreditCard } from 'lucide-react';
import ExportButton from '@/components/ui/ExportButton';

const timeframes = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export default function SalesRecord() {
  const { t } = useTranslation('common');
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('Daily');
  const [totals, setTotals] = useState({ cash: 0, card: 0, grandTotal: 0 });

  useEffect(() => {
    setIsLoading(true);
    const now = new Date();
    let startDate, endDate;

    switch (activeTimeframe) {
      case 'Weekly':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'Monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'Yearly':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default: // Daily
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate = endOfDay(now);
        break;
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const salesRef = collection(db, 'sales');
    const q = query(
      salesRef, 
      where('createdAt', '>=', startTimestamp), 
      where('createdAt', '<=', endTimestamp),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      setSales(salesList);

      let totalCash = 0;
      let totalCard = 0;
      salesList.forEach(sale => {
        const amount = sale.totalAmount || 0;
        if (sale.paymentMethod === 'Card') {
          totalCard += amount;
        } else {
          totalCash += amount;
        }
      });
      setTotals({ cash: totalCash, card: totalCard, grandTotal: totalCash + totalCard });

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeTimeframe]);

  const csvHeaders = [
    { label: "Date", key: "createdAt" },
    { label: "Total Amount", key: "totalAmount" },
    { label: "Payment Method", key: "paymentMethod" },
    { label: "Customer", key: "customerName" },
    { label: "Staff", key: "createdBy" },
  ];

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{t('SalesRecord')}</h2>
        <div className="flex items-center bg-neo-bg p-1 rounded-lg shadow-neo-inset-active">
          {timeframes.map(frame => (
            <button 
              key={frame}
              onClick={() => setActiveTimeframe(frame)}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                activeTimeframe === frame ? 'bg-neo-bg shadow-neo-md text-primary' : 'text-gray-600'
              }`}
            >
              {t(frame)}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 pt-4 border-t border-neo-dark/20">
        <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold text-gray-700">{t('TotalsForPeriod')}</h3>
            <ExportButton data={sales} headers={csvHeaders} filename={`sales_${activeTimeframe}.csv`} />
        </div>
        <div className="flex justify-around text-center mt-2">
          <div>
            <p className="text-sm text-gray-500">{t('TotalCash')}</p>
            <p className="text-lg font-bold text-green-600">{totals.cash.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('TotalCard')}</p>
            <p className="text-lg font-bold text-blue-600">{totals.card.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('GrandTotal')}</p>
            <p className="text-lg font-bold text-gray-900">{totals.grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto pt-4">
        {isLoading && <p>Loading sales...</p>}
        {!isLoading && sales.length === 0 && <p>{t('NoSalesForPeriod')}</p>}
        {sales.map(sale => (
          <div key={sale.id} className="p-3 border border-neo-dark/20 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <p className="font-semibold">{(sale.totalAmount ?? 0).toFixed(2)}</p>
                {sale.paymentMethod === 'Card' ? (
                  <CreditCard className="w-4 h-4 text-blue-500" title="Card Payment" />
                ) : (
                  <Banknote className="w-4 h-4 text-green-500" title="Cash Payment" />
                )}
              </div>
              <p className="text-sm text-gray-500">{formatDate(sale.createdAt, 'p')}</p>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {sale.items?.map(item => `${item.quantity}x ${item.name}`).join(', ') || 'No items listed'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
