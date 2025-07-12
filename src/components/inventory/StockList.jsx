// FILE: src/components/inventory/StockList.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Card from '@/components/ui/Card';
import { Edit, Trash2 } from 'lucide-react';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

const StockLevelIndicator = ({ current, min }) => {
  const percentage = Math.min((current / (min * 2)) * 100, 100);
  let color = 'bg-green-500';
  if (percentage < 50) color = 'bg-yellow-500';
  if (current <= min) color = 'bg-red-500';

  return (
    <div className="w-full bg-neo-bg shadow-neo-inset rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default function StockList({ onEdit, onDelete }) {
  const { t } = useTranslation('common');
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const inventoryCollection = collection(db, 'inventory');
    
    const unsubscribe = onSnapshot(inventoryCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching inventory:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="text-center text-gray-500 py-10">Loading inventory...</div>;
  }

  return (
    <Card title={t('CurrentStockLevels')}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('ItemName')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('StockLevel')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('CurrentMinStock')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t border-neo-dark/20">
                <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500 w-1/3">
                  <StockLevelIndicator current={item.currentStock} min={item.minStock} />
                </td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.currentStock} / {item.minStock} {item.unit}
                </td>
                <td className="py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <NeumorphismButton onClick={() => onEdit(item)} className="!w-auto !p-2 !rounded-full !text-blue-600">
                      <Edit className="w-4 h-4" />
                    </NeumorphismButton>
                    <NeumorphismButton onClick={() => onDelete(item)} className="!w-auto !p-2 !rounded-full !text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </NeumorphismButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
