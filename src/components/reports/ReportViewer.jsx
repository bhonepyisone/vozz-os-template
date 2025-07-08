// FILE: src/components/reports/ReportViewer.jsx

'use client';

import { FileText, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';

const FinancialReport = ({ data }) => {
  if (!data) return null;

  const netProfit = data.totalRevenue - data.totalExpenses;

  return (
    <div className="p-4 bg-neo-bg shadow-neo-inset rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Financial Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-neo-bg rounded-lg shadow-neo-md">
          <p className="text-sm text-green-700">Total Revenue</p>
          <p className="text-2xl font-bold text-green-800">{formatCurrency(data.totalRevenue)}</p>
        </div>
        <div className="p-4 bg-neo-bg rounded-lg shadow-neo-md">
          <p className="text-sm text-red-700">Total Expenses</p>
          <p className="text-2xl font-bold text-red-800">{formatCurrency(data.totalExpenses)}</p>
        </div>
        <div className={`p-4 bg-neo-bg rounded-lg shadow-neo-md`}>
          <p className={`text-sm ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Net Profit</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>{formatCurrency(netProfit)}</p>
        </div>
      </div>
    </div>
  );
};

export default function ReportViewer({ isLoading, reportData }) {
  return (
    <Card title="Financial Report">
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="ml-4 text-gray-500">Generating report...</p>
          </div>
        ) : (
          <FinancialReport data={reportData} />
        )}
      </div>
    </Card>
  );
}
