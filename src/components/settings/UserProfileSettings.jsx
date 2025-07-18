// FILE: src/components/settings/UserProfileSettings.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function UserProfileSettings({ onSuccess }) {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || !name) return;
    setIsLoading(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: name,
      });
      onSuccess(t('ProfileUpdated'));
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Card title={t('YourProfile')}><div>Loading...</div></Card>;
  }

  return (
    <Card title={t('YourProfile')}>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <NeumorphismInput type="text" id="email" value={user.email} disabled />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('FullName')}</label>
          <NeumorphismInput type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? t('Saving') : t('SaveChanges')}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
