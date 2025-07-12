// FILE: src/components/hrm/EditStaffModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Modal from '@/components/ui/Modal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Save } from 'lucide-react';

export default function EditStaffModal({ isOpen, onClose, staffMember, onSuccess }) {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    joinDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (staffMember) {
      setFormData({
        name: staffMember.name || '',
        email: staffMember.email || '',
        role: staffMember.role || 'Staff',
        joinDate: staffMember.joinDate ? format(staffMember.joinDate.toDate(), 'yyyy-MM-dd') : '',
      });
    }
  }, [staffMember]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!staffMember) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', staffMember.id);
      await updateDoc(userDocRef, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        joinDate: Timestamp.fromDate(new Date(formData.joinDate)),
      });
      // FIX: Call the onSuccess function passed from the parent page
      onSuccess({ key: 'StaffDetailsUpdated' });
      onClose();
    } catch (error) {
      console.error("Error updating staff details:", error);
      // In a real app, you'd have a themed error modal here too
      alert("Failed to update details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('Edit')} ${staffMember?.name}`}>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('FullName')}</label>
          <NeumorphismInput type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Email')}</label>
          <NeumorphismInput type="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Role')}</label>
          <NeumorphismSelect name="role" value={formData.role} onChange={handleInputChange}>
            <option>Staff</option>
            <option>Front Desk</option>
            <option>Management</option>
            <option>Admin</option>
          </NeumorphismSelect>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('JoinDate')}</label>
          <NeumorphismInput type="date" name="joinDate" value={formData.joinDate} onChange={handleInputChange} required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5"/>
          <span>{isLoading ? t('Saving') : t('SaveChanges')}</span>
        </NeumorphismButton>
      </form>
    </Modal>
  );
}
