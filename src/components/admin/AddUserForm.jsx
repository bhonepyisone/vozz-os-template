// FILE: src/components/admin/AddUserForm.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';

export default function AddUserForm({ setSuccessMessage }) {
  const { t } = useTranslation('common');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');
  const [shopId, setShopId] = useState('main-shop');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !role || !shopId) {
      setError("Please fill all required fields.");
      return;
    }
    setIsLoading(true);
    setError('');

    // Create a temporary, secondary Firebase app instance.
    // This allows us to create a new user without affecting the currently logged-in admin.
    const tempApp = initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }, 'Secondary');
    const tempAuth = getAuth(tempApp);

    try {
      // 1. Create the new user in Firebase Authentication using the temporary instance.
      const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
      const newUser = userCredential.user;

      // 2. Now, use our main app's database connection (which is authenticated as an admin)
      //    to create the user's data document in Firestore.
      await setDoc(doc(db, 'users', newUser.uid), {
        name,
        email,
        role,
        shopId,
        joinDate: new Date(),
        baseSalary: 0,
        overtimeRate: 1.5,
        kpiBonus: 0,
      });
      
      setSuccessMessage({ key: 'UserCreated', options: { name: name } });
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('Staff');
      setShopId('main-shop');
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      // Clean up the temporary app instance
      await deleteApp(tempApp);
    }
  };

  return (
    <Card title={t('AddNewUser')}>
      <form onSubmit={handleAddUser} className="space-y-4">
        <div>
          <label className="text-sm font-medium">{t('FullName')}</label>
          <NeumorphismInput type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">{t('Email')}</label>
          <NeumorphismInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">{t('InitialPassword')}</label>
          <NeumorphismInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">{t('Role')}</label>
          <NeumorphismSelect value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Staff</option>
            <option>Front Desk</option>
            <option>Management</option>
            <option>Admin</option>
          </NeumorphismSelect>
        </div>
        <div>
          <label className="text-sm font-medium">{t('ShopID')}</label>
          <NeumorphismInput type="text" value={shopId} onChange={(e) => setShopId(e.target.value)} required />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <NeumorphismButton type="submit" disabled={isLoading}>
          <PlusCircle className="w-5 h-5" />
          <span>{isLoading ? t('CreatingUser') : t('CreateUser')}</span>
        </NeumorphismButton>
      </form>
    </Card>
  );
}
