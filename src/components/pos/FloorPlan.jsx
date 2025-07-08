// FILE: src/components/pos/FloorPlan.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { PlusCircle, Trash2 } from 'lucide-react';
import TableStatusModal from './TableStatusModal';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const Table = ({ table, onSelect, isSelected }) => {
  const statusStyles = {
    Open: 'text-green-600',
    Seated: 'text-blue-600',
    'Order Taken': 'text-indigo-600',
    'Food Served': 'text-purple-600',
    'Bill Printed': 'text-yellow-700',
    'Needs Cleaning': 'text-red-600',
    Reserved: 'text-gray-600',
  };

  const baseClasses = "w-24 h-24 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 bg-neo-bg";
  const shadowClass = isSelected ? 'shadow-neo-inset-active' : 'shadow-neo-md';

  return (
    <div 
      onClick={() => onSelect(table)}
      className={`${baseClasses} ${shadowClass}`}
    >
      <p className={`font-bold text-xl ${statusStyles[table.status] || 'text-gray-700'}`}>{table.name}</p>
      <p className={`text-center text-xs font-semibold mt-1 ${statusStyles[table.status] || 'text-gray-700'}`}>{table.status}</p>
    </div>
  );
};

export default function FloorPlan({ onTableSelect, selectedTable }) {
  const [tables, setTables] = useState([]);
  const [selectedTableForStatus, setSelectedTableForStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);

  useEffect(() => {
    const tablesQuery = query(collection(db, 'tables'), orderBy('order'));
    const unsubscribe = onSnapshot(tablesQuery, (snapshot) => {
      const tablesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTables(tablesList);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusModalOpen = (table) => {
    setSelectedTableForStatus(table);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (tableId, newStatus) => {
    const tableRef = doc(db, 'tables', tableId);
    await updateDoc(tableRef, { status: newStatus });
    setIsModalOpen(false);
  };

  const handleAddTable = async () => {
    const newTableName = `T${tables.length + 1}`;
    await addDoc(collection(db, 'tables'), {
      name: newTableName,
      status: 'Open',
      order: tables.length + 1,
    });
  };
  
  const handleRemoveClick = () => {
    if (tables.length > 0) {
      setTableToDelete(tables[tables.length - 1]);
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (tableToDelete) {
      await deleteDoc(doc(db, 'tables', tableToDelete.id));
      setTableToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="bg-neo-bg p-6 rounded-2xl shadow-neo-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Floor Plan</h2>
        <div className="flex space-x-2">
          <NeumorphismButton onClick={handleAddTable} className="!w-auto !p-2 !rounded-full !text-green-600"><PlusCircle/></NeumorphismButton>
          <NeumorphismButton onClick={handleRemoveClick} className="!w-auto !p-2 !rounded-full !text-red-600"><Trash2/></NeumorphismButton>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tables.map(table => (
          <div key={table.id} className="relative">
             <Table 
                table={table} 
                onSelect={onTableSelect} 
                isSelected={selectedTable?.id === table.id}
             />
             <button onClick={() => handleStatusModalOpen(table)} className="absolute top-1 right-1 text-xs bg-black/20 text-white rounded-full px-1.5 py-0.5 hover:bg-black/50">
               Edit
             </button>
          </div>
        ))}
      </div>
      <TableStatusModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        table={selectedTableForStatus}
        onStatusChange={handleStatusChange}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Table"
      >
        Are you sure you want to remove table "{tableToDelete?.name}"?
      </ConfirmationModal>
    </div>
  );
}
