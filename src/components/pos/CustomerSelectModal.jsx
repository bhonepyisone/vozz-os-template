// FILE: src/components/pos/CustomerSelectModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import { UserPlus } from 'lucide-react';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function CustomerSelectModal({ isOpen, onClose, onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    
    const customersCollection = collection(db, 'customers');
    const unsubscribe = onSnapshot(customersCollection, (snapshot) => {
      const customerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(customerList);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleAddNewCustomer = async () => {
    if (!newCustomerName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, 'customers'), {
        name: newCustomerName,
        email: '', // Optional fields
        totalSpend: 0,
        tier: 'Bronze',
      });
      onSelectCustomer({ id: docRef.id, name: newCustomerName });
      setNewCustomerName('');
    } catch (error) {
      console.error("Error adding new customer: ", error);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select or Add Customer">
      <div className="space-y-4">
        <NeumorphismInput
          type="text"
          placeholder="Search for a customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-neo-bg shadow-neo-inset rounded-lg">
          {filteredCustomers.map(customer => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="w-full text-left p-2 rounded-md hover:bg-gray-300/50"
            >
              {customer.name}
            </button>
          ))}
        </div>
        <div className="border-t border-neo-dark/20 pt-4 space-y-2">
          <label className="text-sm font-medium">Add New Customer</label>
          <div className="flex space-x-2">
            <NeumorphismInput
              type="text"
              placeholder="New customer name..."
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              className="flex-1"
            />
            <NeumorphismButton
              onClick={handleAddNewCustomer}
              className="!w-auto !p-3 !text-green-600"
            >
              <UserPlus className="w-5 h-5" />
            </NeumorphismButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}
