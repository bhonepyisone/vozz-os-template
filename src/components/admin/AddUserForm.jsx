// FILE: src/components/admin/AddUserForm.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';

export default function AddUserForm({ setSuccessMessage }) {
  const [staffId, setStaffId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff');
  const [shopId, setShopId] = useState('main-shop');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!staffId || !name || !role || !shopId) return;
    setIsLoading(true);

    try {
      await setDoc(doc(db, 'users', staffId), {
        name,
        email,
        role,
        shopId,
      });
      
      setSuccessMessage(`User ${name} has been created successfully!`);
      setStaffId('');
      setName('');
      setEmail('');
      setRole('Staff');
      setShopId('main-shop');
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Pre-register New User</h2>
      <form onSubmit={handleAddUser} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Custom Staff ID</label>
          <NeumorphismInput type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <NeumorphismInput type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Email (Optional)</label>
          <NeumorphismInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Role</label>
          <NeumorphismSelect value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Staff</option>
            <option>Front Desk</option>
            <option>Management</option>
            <option>Admin</option>
          </NeumorphismSelect>
        </div>
        <div>
          <label className="text-sm font-medium">Shop ID</label>
          <NeumorphismInput type="text" value={shopId} onChange={(e) => setShopId(e.target.value)} required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <PlusCircle className="w-5 h-5" />
          <span>{isLoading ? 'Creating User...' : 'Create User'}</span>
        </NeumorphismButton>
      </form>
    </div>
  );
}
