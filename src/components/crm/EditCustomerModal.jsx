// FILE: src/components/crm/EditCustomerModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Save } from 'lucide-react';

export default function EditCustomerModal({ isOpen, onClose, customer, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!customer) return;
    setIsLoading(true);
    try {
      const customerRef = doc(db, 'customers', customer.id);
      await updateDoc(customerRef, {
        name: formData.name,
        email: formData.email,
      });
      onSuccess(`Customer "${formData.name}" updated successfully!`);
      onClose();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Customer: ${customer?.name}`}>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <NeumorphismInput 
            type="text" 
            name="name"
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <NeumorphismInput 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleInputChange}
          />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </NeumorphismButton>
      </form>
    </Modal>
  );
}
