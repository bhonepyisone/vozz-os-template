// FILE: src/components/financials/FinancialStatement.jsx

'use client';

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

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Profit & Loss Statement</h2>
      <p className="text-sm text-gray-500 mb-6">{period}</p>

      <div className="space-y-4">
        {/* Revenue */}
        <div className="flex justify-between items-center py-2 border-b">
          <span className="font-semibold text-gray-700">Total Revenue</span>
          <span className="font-semibold text-gray-900">{formatCurrency(statementData.revenue)}</span>
        </div>

        {/* COGS */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Cost of Goods Sold (COGS)</span>
          <span className="text-gray-600">({formatCurrency(statementData.cogs)})</span>
        </div>

        {/* Gross Profit */}
        <div className="flex justify-between items-center py-2 border-t border-b font-bold">
          <span className="text-gray-800">Gross Profit</span>
          <span className="text-gray-900">{formatCurrency(grossProfit)}</span>
        </div>

        {/* Operating Expenses */}
        <div className="pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Operating Expenses</h3>
          <div className="pl-4 space-y-2 text-sm">
            {Object.entries(statementData.operatingExpenses).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="text-gray-600">({formatCurrency(value)})</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span className="text-gray-700">Total Operating Expenses</span>
              <span className="text-gray-700">({formatCurrency(totalOperatingExpenses)})</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="flex justify-between items-center py-3 border-t-2 border-b-2 border-gray-900 mt-4">
          <span className="text-xl font-bold text-gray-900">Net Profit</span>
          <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
