// FILE: src/components/inventory/SupplierManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Truck, Phone, PlusCircle, Trash2 } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import Card from '@/components/ui/Card';

export default function SupplierManager() {
  const { t } = useTranslation('common');
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierContact, setNewSupplierContact] = useState('');
  const [newSupplierCategory, setNewSupplierCategory] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  useEffect(() => {
    const suppliersCollection = collection(db, 'suppliers');
    const unsubscribe = onSnapshot(suppliersCollection, (snapshot) => {
      const supplierList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuppliers(supplierList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    if (!newSupplierName || !newSupplierCategory) {
      alert("Please provide a name and category for the supplier.");
      return;
    }
    await addDoc(collection(db, 'suppliers'), {
      name: newSupplierName,
      contact: newSupplierContact,
      category: newSupplierCategory,
    });
    setNewSupplierName('');
    setNewSupplierContact('');
    setNewSupplierCategory('');
  };

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (supplierToDelete) {
      await deleteDoc(doc(db, 'suppliers', supplierToDelete.id));
      setSupplierToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <>
      <Card title={t('ManageSuppliers')}>
        <form onSubmit={handleAddSupplier} className="mb-6 p-4 border border-neo-dark/20 rounded-lg space-y-3">
          <h3 className="font-medium text-gray-700">{t('AddSupplier')}</h3>
          <NeumorphismInput 
            type="text" 
            value={newSupplierName} 
            onChange={(e) => setNewSupplierName(e.target.value)} 
            placeholder={t('SupplierName')} 
            required 
          />
          <NeumorphismInput 
            type="text" 
            value={newSupplierContact} 
            onChange={(e) => setNewSupplierContact(e.target.value)} 
            placeholder={t('ContactInfo')} 
          />
          <NeumorphismInput 
            type="text" 
            value={newSupplierCategory} 
            onChange={(e) => setNewSupplierCategory(e.target.value)} 
            placeholder={t('Category')} 
            required 
          />
          <NeumorphismButton type="submit">
            <PlusCircle className="w-5 h-5" />
            <span>{t('AddSupplier')}</span>
          </NeumorphismButton>
        </form>

        <div className="space-y-3">
          {isLoading ? <p>Loading suppliers...</p> : suppliers.map(supplier => (
            <div key={supplier.id} className="p-4 border border-neo-dark/20 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800 flex items-center"><Truck className="w-4 h-4 mr-2 text-gray-400"/>{supplier.name}</p>
                <p className="text-sm text-gray-500 ml-6">{supplier.category}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400"/> {supplier.contact || 'N/A'}
                </span>
                <NeumorphismButton onClick={() => handleDeleteClick(supplier)} className="!w-auto !p-2 !rounded-full !text-red-600">
                  <Trash2 className="w-4 h-4" />
                </NeumorphismButton>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('DeleteSupplier')}
      >
        {t('DeleteSupplierConfirm', { name: supplierToDelete?.name })}
      </ConfirmationModal>
    </>
  );
}
