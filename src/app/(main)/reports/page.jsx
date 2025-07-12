// FILE: src/app/(main)/reports/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import ReportViewer from '@/components/reports/ReportViewer';
import AiSuggestions from '@/components/reports/AiSuggestions';
import PopularItemsChart from '@/components/reports/PopularItemsChart';
import InventorySummary from '@/components/reports/InventorySummary';
import Card from '@/components/ui/Card';

export default function ReportsPage() {
  const { t } = useTranslation('common');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      setIsLoading(true);
      try {
        const salesSnapshot = await getDocs(collection(db, 'sales'));
        const totalRevenue = salesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);

        const expensesSnapshot = await getDocs(collection(db, 'expenses'));
        const totalExpenses = expensesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

        setReportData({ totalRevenue, totalExpenses });
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('ReportsAndAnalytics')}</h1>
      <div className="space-y-8">
        <ReportViewer isLoading={isLoading} reportData={reportData} />
        
        <Card title={t('AI-PoweredSuggestions')}>
          <AiSuggestions reportData={reportData} />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PopularItemsChart />
          <InventorySummary />
        </div>
      </div>
    </div>
  );
}
