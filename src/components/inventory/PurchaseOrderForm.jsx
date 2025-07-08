// FILE: src/components/inventory/PurchaseOrderForm.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import Card from '@/components/ui/Card';

export default function PurchaseOrderForm() {
  const [itemName, setItemName] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [unit, setUnit] = useState('pieces');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName || !currentStock || !minStock) {
      alert("Please fill in all fields.");
      return;
    }
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'inventory'), {
        name: itemName,
        currentStock: Number(currentStock),
        minStock: Number(minStock),
        unit: unit,
      });

      // Reset form
      setItemName('');
      setCurrentStock('');
      setMinStock('');
      setUnit('pieces');
      alert(`${itemName} has been added to inventory!`);

    } catch (error) {
      console.error("Error adding inventory item:", error);
      alert("Failed to add inventory item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Add Inventory Item">
      <form onSubmit={handleAddItem} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Item Name</label>
          <NeumorphismInput type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Current Stock</label>
          <NeumorphismInput type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Minimum Stock</label>
          <NeumorphismInput type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Unit</label>
          <NeumorphismInput type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <PlusCircle className="w-5 h-5" />
          <span>{isLoading ? 'Adding...' : 'Add Item to Inventory'}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
