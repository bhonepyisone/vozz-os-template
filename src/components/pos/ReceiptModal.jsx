// FILE: src/components/pos/ReceiptModal.jsx

'use client';

import Modal from '@/components/ui/Modal';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Printer } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { format } from 'date-fns';

export default function ReceiptModal({ isOpen, onClose, order }) {
  const { user } = useAuthStore();

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen || !order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Print Receipt">
      <div id="receipt-content" className="text-black bg-white p-4 font-mono">
        <div className="text-center">
          <h2 className="text-xl font-bold">Vozz OS</h2>
          <p className="text-xs">{user.shopId}</p>
          <p className="text-xs">{format(new Date(), 'PPpp')}</p>
        </div>
        <div className="border-t border-b border-dashed border-black my-2 py-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{order.subtotal.toFixed(2)}</span>
          </div>
          {order.promoAmount > 0 && (
            <div className="flex justify-between">
              <span>Promotion ({order.promoPercent}%):</span>
              <span>-{(order.promoAmount || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax ({order.taxPercent}%):</span>
            <span>{order.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-black pt-1">
            <span>TOTAL:</span>
            <span>{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-center text-xs mt-4">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
      <NeumorphismButton onClick={handlePrint} className="w-full mt-4">
        <Printer className="w-5 h-5 mr-2" />
        Print
      </NeumorphismButton>
    </Modal>
  );
}
