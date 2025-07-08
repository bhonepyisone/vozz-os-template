// FILE: src/app/admin/shops/page.jsx

'use client';

import { useState } from 'react';
import ShopList from '@/components/admin/ShopList';
import AddShopForm from '@/components/admin/AddShopForm';
import SuccessModal from '@/components/ui/SuccessModal';

export default function AdminShopsPage() {
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Shop Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ShopList />
          </div>
          <div className="lg:col-span-1">
            <AddShopForm setSuccessMessage={setSuccessMessage} />
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title="Shop Created!"
      >
        {successMessage}
      </SuccessModal>
    </>
  );
}
