// FILE: src/components/reports/InventorySummary.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function InventorySummary() {
  const { t } = useTranslation('common');
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const inventoryCollection = collection(db, 'inventory');
    
    const unsubscribe = onSnapshot(inventoryCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filteredLowStock = items.filter(item => item.currentStock <= item.minStock);
      setLowStockItems(filteredLowStock);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card title={t('InventorySummary')}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="h-full">
          <h3 className="font-semibold text-gray-700 mb-2">{t('LowStockItems')}</h3>
          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="p-3 bg-yellow-100/50 border border-yellow-300/50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {t('StockLevel')}: {item.currentStock} / {item.minStock} {item.unit}
                      </p>
                    </div>
                  </div>
                  <NeumorphismButton className="!w-auto !px-3 !py-1 !text-xs">
                    {t('Reorder')}
                  </NeumorphismButton>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 h-full flex items-center justify-center">
              {t('NoLowStockItems')}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
