// FILE: src/components/settings/ChangePassword.jsx

'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { KeyRound } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function ChangePassword({ onSuccess, onError }) {
  const { t } = useTranslation('common');
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      onError("New passwords do not match.");
      return;
    }
    if (!user) {
      onError("You must be logged in to change your password.");
      return;
    }
    setIsLoading(true);
    onError('');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      onSuccess(t('PasswordUpdated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === 'auth/wrong-password') {
        onError("The current password you entered is incorrect.");
      } else {
        onError("Failed to change password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title={t('ChangePassword')}>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('CurrentPassword')}</label>
          <NeumorphismInput 
            type="password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('NewPassword')}</label>
          <NeumorphismInput 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('ConfirmNewPassword')}</label>
          <NeumorphismInput 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <KeyRound className="w-5 h-5" />
          <span>{isLoading ? t('Saving') : t('UpdatePassword')}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
