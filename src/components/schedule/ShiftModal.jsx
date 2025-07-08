// FILE: src/components/schedule/ShiftModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import { Save } from 'lucide-react';
import { format } from 'date-fns';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function ShiftModal({ isOpen, onClose, selectedDate }) {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [shiftType, setShiftType] = useState('Morning (9am - 5pm)');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      setStaffList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [isOpen]);

  const handleAddShift = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !selectedDate) {
      alert("Please select a staff member.");
      return;
    }
    setIsLoading(true);
    try {
      const selectedStaff = staffList.find(s => s.id === selectedStaffId);
      await addDoc(collection(db, 'shifts'), {
        employeeId: selectedStaffId,
        employeeName: selectedStaff.name,
        date: Timestamp.fromDate(selectedDate),
        shiftType,
      });
      alert("Shift added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding shift:", error);
      alert("Failed to add shift.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Shift for ${selectedDate ? format(selectedDate, 'PPP') : ''}`}>
      <form onSubmit={handleAddShift} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff</label>
          <NeumorphismSelect value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required>
            <option value="">-- Select a staff member --</option>
            {staffList.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
          </NeumorphismSelect>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
          <NeumorphismSelect value={shiftType} onChange={(e) => setShiftType(e.target.value)}>
            <option>Morning (9am - 5pm)</option>
            <option>Evening (4pm - 12am)</option>
            <option>Closing (6pm - 2am)</option>
            <option>All Day</option>
          </NeumorphismSelect>
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Saving...' : 'Save Shift'}</span>
        </NeumorphismButton>
      </form>
    </Modal>
  );
}
