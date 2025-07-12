// FILE: src/components/financials/FinancialStatement.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Card from '@/components/ui/Card';
import ExportButton from '@/components/ui/ExportButton';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Calculator, Loader2 } from 'lucide-react';

export default function FinancialStatement() {
  const { t } = useTranslation('common');
  // State for date range selection
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // State for the calculated P&L data
  const [pnlData, setPnlData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStatement = async () => {
    setIsLoading(true);
    setPnlData(null);

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Ensure we get the full end day

      const startTimestamp = Timestamp.fromDate(start);
      const endTimestamp = Timestamp.fromDate(end);

      // 1. Fetch Sales Data
      const salesQuery = query(
        collection(db, 'sales'),
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp)
      );
      const salesSnapshot = await getDocs(salesQuery);
      const totalRevenue = salesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);

      // 2. Fetch Expenses Data
      const expensesQuery = query(
        collection(db, 'expenses'),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp)
      );
      const expensesSnapshot = await getDocs(expensesQuery);
      
      let totalCogs = 0;
      let operatingExpenses = {};

      expensesSnapshot.docs.forEach(doc => {
        const expense = doc.data();
        const amount = expense.amount || 0;
        if (expense.category === 'COGS') {
          totalCogs += amount;
        } else {
          operatingExpenses[expense.category] = (operatingExpenses[expense.category] || 0) + amount;
        }
      });

      const totalOperatingExpenses = Object.values(operatingExpenses).reduce((a, b) => a + b, 0);
      const grossProfit = totalRevenue - totalCogs;
      const netProfit = grossProfit - totalOperatingExpenses;

      setPnlData({
        period: `${format(start, 'PPP')} - ${format(end, 'PPP')}`,
        revenue: totalRevenue,
        cogs: totalCogs,
        operatingExpenses,
        totalOperatingExpenses,
        grossProfit,
        netProfit,
      });

    } catch (error) {
      console.error("Error generating P&L Statement:", error);
      alert("Failed to generate statement. Check console for errors.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => value.toLocaleString(undefined, {minimumFractionDigits: 2});

  // Prepare data for CSV export if pnlData exists
  const csvData = pnlData ? [
      { item: "Total Revenue", amount: pnlData.revenue },
      { item: "Cost of Goods Sold (COGS)", amount: -pnlData.cogs },
      { item: "Gross Profit", amount: pnlData.grossProfit },
      ...Object.entries(pnlData.operatingExpenses).map(([key, value]) => ({
          item: `Expense: ${key}`,
          amount: -value
      })),
      { item: "Total Operating Expenses", amount: -pnlData.totalOperatingExpenses },
      { item: "Net Profit", amount: pnlData.netProfit }
  ] : [];

  const csvHeaders = [
      { label: "Line Item", key: "item" },
      { label: "Amount", key: "amount" }
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{t('ProfitAndLossStatement')}</h2>
        {pnlData && <ExportButton data={csvData} headers={csvHeaders} filename="profit_and_loss_statement.csv" />}
      </div>
      
      {/* Date Range Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-neo-dark/20 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('StartDate')}</label>
          <NeumorphismInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('EndDate')}</label>
          <NeumorphismInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="self-end">
          <NeumorphismButton onClick={handleGenerateStatement} disabled={isLoading}>
            <Calculator className="w-5 h-5" />
            <span>{isLoading ? t('Generating') : t('Generate')}</span>
          </NeumorphismButton>
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-primary animate-spin"/></div>}

      {/* P&L Display */}
      {pnlData && (
        <div className="space-y-4 mt-6">
          <p className="text-center font-semibold text-gray-800">{pnlData.period}</p>
          <div className="flex justify-between items-center py-2 border-b border-neo-dark/20">
            <span className="font-semibold text-gray-700">{t('TotalRevenue')}</span>
            <span className="font-semibold text-gray-900">{formatCurrency(pnlData.revenue)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">{t('COGS')}</span>
            <span className="text-gray-600">({formatCurrency(pnlData.cogs)})</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-b border-neo-dark/20 font-bold">
            <span className="text-gray-800">{t('GrossProfit')}</span>
            <span className="text-gray-900">{formatCurrency(pnlData.grossProfit)}</span>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">{t('OperatingExpenses')}</h3>
            <div className="pl-4 space-y-2 text-sm">
              {Object.entries(pnlData.operatingExpenses).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{t(key)}</span>
                  <span className="text-gray-600">({formatCurrency(value)})</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t border-neo-dark/20 pt-2 mt-2">
                <span className="text-gray-700">{t('TotalOperatingExpenses')}</span>
                <span className="text-gray-700">({formatCurrency(pnlData.totalOperatingExpenses)})</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-t-2 border-b-2 border-gray-900/50 mt-4">
            <span className="text-xl font-bold text-gray-900">{t('NetProfit')}</span>
            <span className={`text-xl font-bold ${pnlData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(pnlData.netProfit)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
