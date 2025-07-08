// FILE: src/components/ui/Modal.jsx

'use client';

import { X } from 'lucide-react';
import Card from './Card'; // Import the themed Card

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // The dark overlay for the background
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      {/* The modal now uses the themed Card component as its base */}
      <Card title={title} className="w-full max-w-lg relative">
        {/* The close button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-neo-bg rounded-full shadow-neo-md text-gray-500 hover:text-red-500 active:shadow-neo-inset"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* The title is now handled by the Card, so we just render the main content */}
        <div>
          {children}
        </div>
      </Card>
    </div>
  );
};

export default Modal;
