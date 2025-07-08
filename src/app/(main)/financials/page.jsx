// FILE: src/app/(main)/financials/page.jsx

'use client';

import ExpenseTracker from '@/components/financials/ExpenseTracker';
import FinancialStatement from '@/components/financials/FinancialStatement';

export default function FinancialsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Management</h1>
      <div className="space-y-8">
        <ExpenseTracker />
        <FinancialStatement />
      </div>
    </div>
  );
}
