// FILE: src/components/reimbursements/ReimbursementForm.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { Send, Paperclip } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function ReimbursementForm({ onSuccess }) {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !amount || !reason) {
      alert("Please provide an amount and a reason.");
      return;
    }
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'reimbursements'), {
        staffId: user.uid,
        staffName: user.name,
        amount: Number(amount),
        reason,
        status: 'pending',
        requestedAt: Timestamp.now(),
        receiptUrl: '',
      });

      // FIX: Create a notification for the new reimbursement request
      await addDoc(collection(db, 'notifications'), {
        type: 'Reimbursement Request',
        message: `${user.name} has submitted a reimbursement request for ${amount}.`,
        createdAt: Timestamp.now(),
      });

      onSuccess("Reimbursement request submitted successfully!");
      setAmount('');
      setReason('');
      setReceiptFile(null);
    } catch (error) {
      console.error("Error submitting reimbursement request:", error);
      alert("Failed to submit request.");
    } finally {
      setIsLoading(false);
    }
  };

  const NeumorphismTextarea = (props) => (
    <textarea {...props} className="w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none text-sm" />
  );

  return (
    <Card title="Submit Reimbursement">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <NeumorphismInput type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Expense</label>
          <NeumorphismTextarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows="3" required />
        </div>
        <div>
          <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-1">Upload Receipt (Optional)</label>
          <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-neo-dark/30 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-xs text-gray-500">File upload feature coming soon</p>
            </div>
          </div>
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Send className="w-5 h-5" />
          <span>{isLoading ? 'Submitting...' : 'Submit Request'}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
