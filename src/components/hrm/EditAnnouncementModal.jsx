// FILE: src/components/hrm/EditAnnouncementModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Modal from '@/components/ui/Modal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Save } from 'lucide-react';

// FIX: Define the helper component outside the main component function.
// This prevents it from being re-created on every render, solving the focus issue.
const NeumorphismTextarea = (props) => (
  <textarea {...props} className="w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none text-sm" />
);

export default function EditAnnouncementModal({ isOpen, onClose, announcement, onSuccess }) {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({ title: '', content: '', expiresOn: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        expiresOn: announcement.expiresOn ? format(announcement.expiresOn.toDate(), 'yyyy-MM-dd') : '',
      });
    }
  }, [announcement]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!announcement) return;
    setIsLoading(true);
    try {
      const announcementRef = doc(db, 'announcements', announcement.id);
      await updateDoc(announcementRef, {
        title: formData.title,
        content: formData.content,
        expiresOn: formData.expiresOn ? Timestamp.fromDate(new Date(formData.expiresOn)) : null,
      });
      onSuccess("Announcement updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating announcement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('Edit')} ${t('Announcement')}`}>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Title')}</label>
          <NeumorphismInput type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Content')}</label>
          <NeumorphismTextarea name="content" value={formData.content} onChange={handleInputChange} rows="4" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('ExpiresOn')}</label>
          <NeumorphismInput type="date" name="expiresOn" value={formData.expiresOn} onChange={handleInputChange} />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? t('Saving') : t('SaveChanges')}</span>
        </NeumorphismButton>
      </form>
    </Modal>
  );
}
