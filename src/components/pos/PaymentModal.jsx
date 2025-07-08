// FILE: src/components/pos/PaymentModal.jsx

'use client';

import { useState } from 'react';
import { X, CreditCard, Banknote, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function PaymentModal({ isOpen, onClose, onConfirm, total, isLoading }) {
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default to Cash

  const handleConfirm = () => {
    // Pass the selected method to the parent component
    onConfirm(paymentMethod);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Payment">
      <div className="text-center">
        <p className="text-4xl font-bold text-primary mb-6">
          {total.toLocaleString(undefined, {minimumFractionDigits: 2})}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Select Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setPaymentMethod('Cash')}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'Cash' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 text-gray-600 hover:border-primary'
            }`}
          >
            <Banknote className="w-8 h-8 mb-2"/>
            <span className="font-semibold">Cash</span>
          </button>
          <button 
            onClick={() => setPaymentMethod('Card')}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'Card' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 text-gray-600 hover:border-primary'
            }`}
          >
            <CreditCard className="w-8 h-8 mb-2"/>
            <span className="font-semibold">Card</span>
          </button>
        </div>
      </div>

      <button 
        onClick={handleConfirm}
        disabled={isLoading}
        className="w-full mt-8 px-4 py-3 flex items-center justify-center text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Payment'}
      </button>
    </Modal>
  );
}
