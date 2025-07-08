// FILE: src/components/ui/ConfirmationModal.jsx

'use client';

import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  children 
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {children || "This action cannot be undone."}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
        >
          Confirm
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
