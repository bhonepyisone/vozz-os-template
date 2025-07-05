// FILE: src/components/pos/OrderPanel.jsx

'use client';

import { X } from 'lucide-react';

// Placeholder data
const currentOrder = [
  { id: 'M-01', name: 'Signature Burger', price: 1250, quantity: 2 },
  { id: 'M-04', name: 'Iced Coffee', price: 450, quantity: 1 },
];

export default function OrderPanel({ onProcessPayment }) {
  const subtotal = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Order</h2>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {currentOrder.map(item => (
          <div key={item.id} className="flex items-center">
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} x {item.price.toLocaleString()}
              </p>
            </div>
            <p className="font-semibold w-24 text-right">{(item.price * item.quantity).toLocaleString()}</p>
            <button className="ml-2 p-1 text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (7%)</span>
          <span>{tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <button 
          onClick={onProcessPayment}
          className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
        >
          Process Payment
        </button>
      </div>
    </div>
  );
}