// FILE: src/components/hrm/SalaryManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Edit } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function SalaryManager({ onEdit }) {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffList(users);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Card title="Manage Salary Details">
      <div className="space-y-3">
        {isLoading && <p>Loading staff salaries...</p>}
        {staffList.map(staff => (
          <div key={staff.id} className="p-4 border border-neo-dark/20 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">{staff.name}</p>
              <NeumorphismButton onClick={() => onEdit(staff)} className="!w-auto !p-2 !rounded-full !text-blue-600">
                <Edit className="w-4 h-4"/>
              </NeumorphismButton>
            </div>
            <div className="text-sm text-gray-600 mt-2 grid grid-cols-3 gap-4">
              <span>Base: {staff.baseSalary?.toLocaleString() || 'N/A'}</span>
              <span>OT Rate: {staff.overtimeRate || 'N/A'}x</span>
              <span>Bonus: {staff.kpiBonus?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
