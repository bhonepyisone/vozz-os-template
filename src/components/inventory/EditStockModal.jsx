// FILE: src/components/inventory/EditStockModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Save } from 'lucide-react';

export default function EditStockModal({ isOpen, onClose, item, onSuccess }) {
  const [newStock, setNewStock] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setNewStock(item.currentStock);
    }
  }, [item]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!item || newStock === '') return;
    setIsLoading(true);
    try {
      const itemRef = doc(db, 'inventory', item.id);
      await updateDoc(itemRef, {
        currentStock: Number(newStock),
      });
      onSuccess(`Stock for ${item.name} updated successfully!`);
      onClose();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Stock for ${item?.name}`}>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Stock Quantity</label>
          <NeumorphismInput 
            type="number" 
            value={newStock} 
            onChange={(e) => setNewStock(e.target.value)} 
            required 
          />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </NeumorphismButton>
      </form>
    </Modal>
  );
}
