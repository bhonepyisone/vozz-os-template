// FILE: src/components/hrm/EditStaffModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import Modal from '@/components/ui/Modal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Save } from 'lucide-react';

export default function EditStaffModal({ isOpen, onClose, staffMember }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    joinDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (staffMember) {
      setFormData({
        name: staffMember.name || '',
        email: staffMember.email || '',
        role: staffMember.role || 'Staff',
        // Format the Firestore Timestamp to a yyyy-MM-dd string for the input
        joinDate: staffMember.joinDate ? format(staffMember.joinDate.toDate(), 'yyyy-MM-dd') : '',
      });
    }
  }, [staffMember]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!staffMember) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', staffMember.id);
      await updateDoc(userDocRef, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        joinDate: Timestamp.fromDate(new Date(formData.joinDate)),
      });
      alert("Staff details updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating staff details:", error);
      alert("Failed to update details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${formData.name}`}>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <NeumorphismInput type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <NeumorphismInput type="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <NeumorphismSelect name="role" value={formData.role} onChange={handleInputChange}>
            <option>Staff</option>
            <option>Front Desk</option>
            <option>Management</option>
            <option>Admin</option>
          </NeumorphismSelect>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
          <NeumorphismInput type="date" name="joinDate" value={formData.joinDate} onChange={handleInputChange} required />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5"/>
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </NeumorphismButton>
      </form>
    </Modal>
  );
}
