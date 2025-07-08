// FILE: src/components/financials/ExpenseTracker.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, Timestamp, query, where, orderBy } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import ExportButton from '@/components/ui/ExportButton';

const timeframes = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('Daily');
  const [totalExpenses, setTotalExpenses] = useState(0);
  
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('COGS');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const expensesCollection = query(
        collection(db, 'expenses'),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(expensesCollection, (snapshot) => {
      const expenseList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? formatDate(doc.data().date.toDate(), 'PP') : 'N/A',
      }));
      setExpenses(expenseList);
      
      const total = expenseList.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpenses(total);
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeTimeframe]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'expenses'), {
        description,
        category,
        amount: Number(amount),
        date: Timestamp.now(),
      });
      setDescription('');
      setCategory('COGS');
      setAmount('');
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const csvHeaders = [
      { label: "Date", key: "date" },
      { label: "Description", key: "description" },
      { label: "Category", key: "category" },
      { label: "Amount", key: "amount" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card title="Add New Expense" className="lg:col-span-1">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <NeumorphismInput type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <NeumorphismSelect id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>COGS</option>
              <option>Labor</option>
              <option>Rent</option>
              <option>Utilities</option>
              <option>Marketing</option>
              <option>Other</option>
            </NeumorphismSelect>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <NeumorphismInput type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <NeumorphismButton type="submit" disabled={isSubmitting}>
            <PlusCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'Adding...' : 'Add Expense'}</span>
          </NeumorphismButton>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Expenses Record</h2>
            <div className="flex items-center bg-neo-bg p-1 rounded-lg shadow-neo-inset-active">
                {timeframes.map(frame => (
                    <button 
                    key={frame}
                    onClick={() => setActiveTimeframe(frame)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                        activeTimeframe === frame ? 'bg-neo-bg shadow-neo-md text-primary' : 'text-gray-600'
                    }`}
                    >
                    {frame}
                    </button>
                ))}
            </div>
        </div>
        <div className="mb-4 pt-4 border-t border-b border-neo-dark/20">
            <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold text-gray-700">Total for Period</h3>
                <ExportButton data={expenses} headers={csvHeaders} filename={`expenses_${activeTimeframe}.csv`} />
            </div>
            <div className="text-center mt-2">
                <p className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
        </div>
        <div className="overflow-x-auto max-h-96">
          {isLoading ? (
            <p>Loading expenses...</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-t border-neo-dark/20">
                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                    <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.description}</td>
                    <td className="py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                    <td className="py-4 whitespace-nowrap text-sm text-gray-500 text-right">{expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
