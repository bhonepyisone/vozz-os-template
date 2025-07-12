// FILE: src/components/hrm/SalaryManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import Card from '@/components/ui/Card'; // FIX: Add the missing import for Card
import NeumorphismInput from '@/components/ui/NeumorphismInput';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function SalaryManager({ onEdit, setSuccessMessage }) {
  const { t } = useTranslation('common');
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

  if (isLoading) {
    return <Card title={t('ManageSalaryDetails')}><p>Loading...</p></Card>;
  }

  return (
    <Card title={t('ManageSalaryDetails')}>
      <div className="space-y-3">
        {staffList.map(staff => (
          <div key={staff.id} className="p-4 border border-neo-dark/20 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">{staff.name}</p>
              <NeumorphismButton onClick={() => onEdit(staff)} className="!w-auto !p-2 !rounded-full !text-blue-600">
                <Save className="w-4 h-4"/>
              </NeumorphismButton>
            </div>
            <div className="text-sm text-gray-600 mt-2 grid grid-cols-3 gap-4">
              <span>{t('BaseSalary')}: {staff.baseSalary?.toLocaleString() || 'N/A'}</span>
              <span>{t('OvertimeRate')}: {staff.overtimeRate || 'N/A'}x</span>
              <span>{t('KPIBonus')}: {staff.kpiBonus?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
