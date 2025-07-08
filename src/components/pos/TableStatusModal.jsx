// FILE: src/components/pos/TableStatusModal.jsx

'use client';

import Modal from '@/components/ui/Modal';

const STATUS_OPTIONS = [
  'Open', 'Seated', 'Order Taken', 'Food Served', 'Bill Printed', 'Needs Cleaning', 'Reserved'
];

export default function TableStatusModal({ isOpen, onClose, table, onStatusChange }) {
  if (!isOpen || !table) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Status for ${table.name}`}>
      <div className="grid grid-cols-2 gap-4">
        {STATUS_OPTIONS.map(status => (
          <button
            key={status}
            onClick={() => onStatusChange(table.id, status)}
            className={`p-4 rounded-lg text-center font-semibold transition-colors ${
              table.status === status 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </Modal>
  );
}
