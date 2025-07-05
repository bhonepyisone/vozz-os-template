// FILE: src/components/pos/PaymentModal.jsx

'use client';

import { X, CreditCard, Banknote } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, total }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Confirm Payment</h2>
        <p className="text-center text-4xl font-bold text-primary mb-6">
          {total.toLocaleString(undefined, {minimumFractionDigits: 2})}
        </p>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 border-2 border-primary bg-primary/10 rounded-lg text-primary">
              <Banknote className="w-8 h-8 mb-2"/>
              <span className="font-semibold">Cash</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border rounded-lg text-gray-600 hover:border-primary hover:text-primary">
              <CreditCard className="w-8 h-8 mb-2"/>
              <span className="font-semibold">Card</span>
            </button>
          </div>
        </div>

        <button 
          onClick={onClose} // Should handle actual payment logic
          className="w-full mt-8 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}