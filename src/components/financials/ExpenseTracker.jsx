// FILE: src/components/financials/ExpenseTracker.jsx

'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

// Placeholder data - this will come from your financials data
const initialExpenses = [
  { id: 1, date: '2025-07-04', description: 'Vegetable Supply', category: 'COGS', amount: 15000 },
  { id: 2, date: '2025-07-03', description: 'Electricity Bill', category: 'Utilities', amount: 8500 },
  { id: 3, date: '2025-07-01', description: 'Staff Salaries - June', category: 'Labor', amount: 120000 },
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState(initialExpenses);

  const handleAddExpense = (e) => {
    e.preventDefault();
    // Logic to add a new expense would go here
    // For now, we'll just log to the console
    console.log("Adding a new expense...");
    alert("New expense added (simulation)!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add Expense Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" id="description" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
              <option>COGS</option>
              <option>Labor</option>
              <option>Rent</option>
              <option>Utilities</option>
              <option>Marketing</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" id="amount" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
          </div>
          <button type="submit" className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Expense
          </button>
        </form>
      </div>

      {/* Recent Expenses Table */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Expenses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{expense.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
