// FILE: src/components/admin/AddShopForm.jsx

'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function AddShopForm({ setSuccessMessage }) {
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddShop = async (e) => {
    e.preventDefault();
    if (!shopId || !shopName) return;
    setIsLoading(true);

    try {
      await setDoc(doc(db, 'shops', shopId), { name: shopName });
      setSuccessMessage(`Shop "${shopName}" has been created successfully!`);
      setShopId('');
      setShopName('');
    } catch (error) {
      console.error("Error creating shop:", error);
      // In a real app, you'd have a themed error modal here too
      alert("Failed to create shop.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Create New Shop</h2>
      <form onSubmit={handleAddShop} className="space-y-4">
        <div>
          <label className="text-sm font-medium">New Shop ID</label>
          <NeumorphismInput type="text" value={shopId} onChange={(e) => setShopId(e.target.value)} placeholder="e.g., second-branch" required />
        </div>
        <div>
          <label className="text-sm font-medium">Shop Name</label>
          <NeumorphismInput type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g., Vozz OS Second Branch" required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <PlusCircle className="w-5 h-5" />
          <span>{isLoading ? 'Creating Shop...' : 'Create Shop'}</span>
        </NeumorphismButton>
      </form>
    </div>
  );
}
