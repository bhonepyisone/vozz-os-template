// FILE: src/app/(main)/menu/page.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import MenuList from '@/components/menu/MenuList';
import RecipeEditor from '@/components/menu/RecipeEditor';
import EditMenuModal from '@/components/menu/EditMenuModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SuccessModal from '@/components/ui/SuccessModal';

export default function MenuPage() {
  const { t } = useTranslation('common');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleEditClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMenuItem(null);
  };

  const handleDeleteClick = (menuItem) => {
    setMenuItemToDelete(menuItem);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (menuItemToDelete) {
      await deleteDoc(doc(db, 'menu', menuItemToDelete.id));
      setMenuItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-700 mb-6" style={{textShadow: '1px 1px 1px #ffffff'}}>{t('MenuManagement')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MenuList onEdit={handleEditClick} onDelete={handleDeleteClick} />
          </div>
          <div className="lg:col-span-1">
            <RecipeEditor setSuccessMessage={setSuccessMessage} />
          </div>
        </div>
      </div>

      <EditMenuModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        menuItem={selectedMenuItem}
        onSuccess={setSuccessMessage}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('DeleteMenuItem')}
      >
        {t('DeleteConfirm', { name: menuItemToDelete?.name })}
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
