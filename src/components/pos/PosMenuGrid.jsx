// FILE: src/components/pos/PosMenuGrid.jsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';

const MenuItem = ({ item, onSelect }) => (
  <button 
    onClick={() => onSelect(item)}
    className="bg-neo-bg p-4 rounded-lg text-center cursor-pointer transition-all shadow-neo-md hover:text-primary active:shadow-neo-inset"
  >
    <div className="text-4xl mb-2">{item.image}</div>
    <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
    <p className="text-xs text-gray-500">{item.price.toLocaleString()}</p>
  </button>
);

export default function PosMenuGrid({ onAddItem }) {
  const { t } = useTranslation('common');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const menuCollection = collection(db, 'menu');
    const unsubscribe = onSnapshot(menuCollection, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categorizedMenuItems = useMemo(() => {
    const filtered = menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [menuItems, searchTerm]);

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg">
       <div className="flex justify-between items-center mb-4">
         <h2 className="text-xl font-semibold text-gray-700">{t('Menu')}</h2>
         <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
           <NeumorphismInput
             type="text"
             placeholder={t('SearchMenu')}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10 !w-64"
           />
         </div>
       </div>
       {isLoading ? (
         <div className="text-center text-gray-500">{t('LoadingMenu')}</div>
       ) : (
         <div className="space-y-6">
          {Object.entries(categorizedMenuItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg font-bold text-gray-600 mb-3 border-b border-neo-dark/30 pb-2">{category}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {items.map(item => (
                  <MenuItem key={item.id} item={item} onSelect={onAddItem} />
                ))}
              </div>
            </div>
          ))}
         </div>
       )}
    </div>
  );
}
