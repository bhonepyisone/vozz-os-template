// FILE: src/components/reports/PopularItemsChart.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function PopularItemsChart() {
  const { t } = useTranslation('common');
  const [itemData, setItemData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesSnapshot = await getDocs(collection(db, 'sales'));
        const itemCounts = {};

        salesSnapshot.forEach(doc => {
          const sale = doc.data();
          if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
              if (item.name) {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
              }
            });
          }
        });

        const chartData = Object.entries(itemCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setItemData(chartData);

      } catch (error) {
        console.error("Error fetching popular items data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <Card title={t('PopularMenuItems')}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={itemData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip cursor={{fill: 'rgba(129, 140, 248, 0.1)'}}/>
              <Bar dataKey="count" name="Units Sold" fill="#818cf8" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
