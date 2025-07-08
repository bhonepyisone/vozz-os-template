// FILE: src/components/financials/FinancialStatement.jsx

'use client';

import Card from '@/components/ui/Card';
import ExportButton from '@/components/ui/ExportButton'; // Import the export button

// Placeholder data - this will be calculated from your financial records
const statementData = {
  revenue: 450000,
  cogs: 180000,
  operatingExpenses: {
    labor: 120000,
    rent: 50000,
    utilities: 8500,
    marketing: 5000,
  },
};

export default function FinancialStatement({ period = "Month to Date" }) {
  const grossProfit = statementData.revenue - statementData.cogs;
  const totalOperatingExpenses = Object.values(statementData.operatingExpenses).reduce((a, b) => a + b, 0);
  const netProfit = grossProfit - totalOperatingExpenses;

  const formatCurrency = (value) => value.toLocaleString();

  // Prepare data for CSV export
  const csvData = [
      { item: "Total Revenue", amount: statementData.revenue },
      { item: "Cost of Goods Sold (COGS)", amount: -statementData.cogs },
      { item: "Gross Profit", amount: grossProfit },
      ...Object.entries(statementData.operatingExpenses).map(([key, value]) => ({
          item: `Expense: ${key}`,
          amount: -value
      })),
      { item: "Total Operating Expenses", amount: -totalOperatingExpenses },
      { item: "Net Profit", amount: netProfit }
  ];

  const csvHeaders = [
      { label: "Line Item", key: "item" },
      { label: "Amount", key: "amount" }
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700">Profit & Loss Statement</h2>
        <ExportButton data={csvData} headers={csvHeaders} filename="profit_and_loss_statement.csv" />
      </div>
      <p className="text-sm text-gray-500 mb-6 -mt-1">{period}</p>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-neo-dark/20">
          <span className="font-semibold text-gray-700">Total Revenue</span>
          <span className="font-semibold text-gray-900">{formatCurrency(statementData.revenue)}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Cost of Goods Sold (COGS)</span>
          <span className="text-gray-600">({formatCurrency(statementData.cogs)})</span>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-b border-neo-dark/20 font-bold">
          <span className="text-gray-800">Gross Profit</span>
          <span className="text-gray-900">{formatCurrency(grossProfit)}</span>
        </div>

        <div className="pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Operating Expenses</h3>
          <div className="pl-4 space-y-2 text-sm">
            {Object.entries(statementData.operatingExpenses).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="text-gray-600">({formatCurrency(value)})</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold border-t border-neo-dark/20 pt-2 mt-2">
              <span className="text-gray-700">Total Operating Expenses</span>
              <span className="text-gray-700">({formatCurrency(totalOperatingExpenses)})</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-t-2 border-b-2 border-gray-900/50 mt-4">
          <span className="text-xl font-bold text-gray-900">Net Profit</span>
          <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </span>
        </div>
      </div>
    </Card>
  );
}
