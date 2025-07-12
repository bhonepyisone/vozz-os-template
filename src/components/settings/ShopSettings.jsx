// FILE: src/components/settings/ShopSettings.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function ShopSettings({ onSuccess }) {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [shopName, setShopName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      if (user?.shopId) {
        const shopDocRef = doc(db, 'shops', user.shopId);
        const shopDoc = await getDoc(shopDocRef);
        if (shopDoc.exists()) {
          setShopName(shopDoc.data().name);
        }
      }
    };
    fetchShopData();
  }, [user]);

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    if (!user?.shopId || !shopName) return;
    setIsLoading(true);

    try {
      const shopDocRef = doc(db, 'shops', user.shopId);
      await updateDoc(shopDocRef, { name: shopName });
      onSuccess(t('ShopNameUpdated'));
    } catch (error) {
      console.error("Error updating shop name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title={t('ShopSettings')}>
      <form onSubmit={handleUpdateShop} className="space-y-4">
        <div>
          <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">{t('ShopName')}</label>
          <NeumorphismInput type="text" id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? t('Saving') : t('SaveChanges')}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
