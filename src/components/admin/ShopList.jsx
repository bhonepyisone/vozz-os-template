// FILE: src/components/admin/ShopList.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Loader2, Building } from 'lucide-react';

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const shopsCollection = collection(db, 'shops');
    const unsubscribe = onSnapshot(shopsCollection, (snapshot) => {
      const shopList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShops(shopList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">All Shops</h2>
      <div className="space-y-3">
        {shops.map((shop) => (
          <div key={shop.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-white flex items-center">
                <Building className="w-4 h-4 mr-2 text-gray-400"/>
                {shop.name}
              </p>
              <p className="text-sm text-gray-400 ml-6">Shop ID: {shop.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
