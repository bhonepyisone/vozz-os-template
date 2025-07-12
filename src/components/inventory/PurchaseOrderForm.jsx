// FILE: src/components/inventory/PurchaseOrderForm.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import Card from '@/components/ui/Card';

export default function PurchaseOrderForm({ setSuccessMessage }) {
  const { t } = useTranslation('common');
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

      setSuccessMessage(`${itemName} has been added to inventory!`);
      setItemName('');
      setCurrentStock('');
      setMinStock('');
      setUnit('pieces');

    } catch (error) {
      console.error("Error adding inventory item:", error);
      alert("Failed to add inventory item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title={t('AddInventoryItem')}>
      <form onSubmit={handleAddItem} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">{t('ItemName')}</label>
          <NeumorphismInput type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">{t('CurrentStock')}</label>
          <NeumorphismInput type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">{t('MinimumStock')}</label>
          <NeumorphismInput type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">{t('Unit')}</label>
          <NeumorphismInput type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <PlusCircle className="w-5 h-5" />
          <span>{isLoading ? t('Saving') : t('AddItemToInventory')}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
