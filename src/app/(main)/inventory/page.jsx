// FILE: src/app/(main)/inventory/page.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import StockList from '@/components/inventory/StockList';
import PurchaseOrderForm from '@/components/inventory/PurchaseOrderForm';
import SupplierManager from '@/components/inventory/SupplierManager';
import EditStockModal from '@/components/inventory/EditStockModal';
import SuccessModal from '@/components/ui/SuccessModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function InventoryPage() {
  const { t } = useTranslation('common');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await deleteDoc(doc(db, 'inventory', itemToDelete.id));
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('InventoryManagement')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <StockList onEdit={handleEditClick} onDelete={handleDeleteClick} />
          </div>

          <div className="space-y-8">
            <PurchaseOrderForm setSuccessMessage={setSuccessMessage} />
            <SupplierManager />
          </div>

        </div>
      </div>

      <EditStockModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={itemToEdit}
        onSuccess={setSuccessMessage}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Inventory Item"
      >
        Are you sure you want to delete the item &quot;{itemToDelete?.name}&quot;? This action cannot be undone.
      </ConfirmationModal>

      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title="Success!"
      >
        {successMessage}
      </SuccessModal>
    </>
  );
}
