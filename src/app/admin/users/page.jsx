// FILE: src/app/admin/users/page.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import UserList from '@/components/admin/UserList';
import AddUserForm from '@/components/admin/AddUserForm';
import EditUserModal from '@/components/admin/EditUserModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SuccessModal from '@/components/ui/SuccessModal';

export default function AdminUsersPage() {
  const { t } = useTranslation('common');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteDoc(doc(db, 'users', userToDelete.id));
      setUserToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-6">{t('UserManagement')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UserList onEdit={handleEditClick} onDelete={handleDeleteClick} />
          </div>
          <div className="lg:col-span-1">
            <AddUserForm setSuccessMessage={setSuccessMessage} />
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage('')}
        title={t('Success')}
      >
        {/* FIX: Use the t() function on the message object to get the translated string */}
        {t(successMessage.key || successMessage, successMessage.options)}
      </SuccessModal>

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSuccess={setSuccessMessage}
      />
      
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('DeleteStaffMember')}
      >
        {t('DeleteStaffConfirm', { name: userToDelete?.name })}
      </ConfirmationModal>
    </>
  );
}
