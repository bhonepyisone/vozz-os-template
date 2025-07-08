// FILE: src/components/menu/MenuList.jsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Edit, Trash2 } from 'lucide-react';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function MenuList({ onEdit, onDelete }) {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const menuCollection = collection(db, 'menu');
    const unsubscribe = onSnapshot(menuCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching menu items:", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categorizedMenuItems = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  if (isLoading) {
    return <div className="text-center text-gray-500 py-10">Loading menu...</div>;
  }

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Menu Items</h2>
      <div className="space-y-6">
        {Object.entries(categorizedMenuItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-bold text-gray-600 mb-3 border-b border-neo-dark/30 pb-2">{category}</h3>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="p-4 border border-neo-dark/20 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-700">{item.price?.toLocaleString()}</p>
                    <NeumorphismButton onClick={() => onEdit(item)} className="!w-auto !p-2 !text-blue-600">
                      <Edit className="w-4 h-4" />
                    </NeumorphismButton>
                    <NeumorphismButton onClick={() => onDelete(item)} className="!w-auto !p-2 !text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </NeumorphismButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
