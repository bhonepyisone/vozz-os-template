// FILE: src/components/ui/SuccessModal.jsx

'use client';

import Modal from './Modal';
import NeumorphismButton from './NeumorphismButton';
import { CheckCircle } from 'lucide-react';

// It now accepts an 'actions' prop to render extra buttons
export default function SuccessModal({ isOpen, onClose, title = "Success!", children, actions }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{children}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 space-y-2">
        {/* Render any extra action buttons here */}
        {actions}
        <NeumorphismButton onClick={onClose} className="!text-gray-700">
          OK
        </NeumorphismButton>
      </div>
    </Modal>
  );
}
