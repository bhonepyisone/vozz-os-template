// FILE: src/components/hrm/EditSalaryModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { Save } from 'lucide-react';

export default function EditSalaryModal({ isOpen, onClose, staffMember, onSuccess }) {
  const [salaryDetails, setSalaryDetails] = useState({
    baseSalary: '',
    overtimeRate: '',
    kpiBonus: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (staffMember) {
      setSalaryDetails({
        baseSalary: staffMember.baseSalary || '',
        overtimeRate: staffMember.overtimeRate || '',
        kpiBonus: staffMember.kpiBonus || '',
      });
    }
  }, [staffMember]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalaryDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!staffMember) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', staffMember.id);
      await updateDoc(userDocRef, {
        baseSalary: Number(salaryDetails.baseSalary),
        overtimeRate: Number(salaryDetails.overtimeRate),
        kpiBonus: Number(salaryDetails.kpiBonus),
      });
      onSuccess(`Salary for ${staffMember.name} updated successfully!`);
      onClose();
    } catch (error) {
      console.error("Error updating salary details:", error);
      alert("Failed to update details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Salary for ${staffMember?.name}`}>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
          <NeumorphismInput type="number" id="baseSalary" name="baseSalary" value={salaryDetails.baseSalary} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="overtimeRate" className="block text-sm font-medium text-gray-700 mb-1">Overtime Rate (e.g., 1.5 for 1.5x)</label>
          <NeumorphismInput type="number" id="overtimeRate" name="overtimeRate" step="0.1" value={salaryDetails.overtimeRate} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="kpiBonus" className="block text-sm font-medium text-gray-700 mb-1">KPI Bonus</label>
          <NeumorphismInput type="number" id="kpiBonus" name="kpiBonus" value={salaryDetails.kpiBonus} onChange={handleInputChange} />
        </div>
        <NeumorphismButton type="submit" disabled={isLoading}>
          <Save className="w-5 h-5" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </NeumorphismButton>
      </form>
    </Modal>
  );
}
