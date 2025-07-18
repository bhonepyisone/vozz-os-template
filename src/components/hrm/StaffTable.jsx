// FILE: src/components/hrm/StaffTable.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { User, Mail, Shield, Calendar, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismButton from '@/components/ui/NeumorphismButton';
import { formatDate } from '@/lib/utils';
import ExportButton from '@/components/ui/ExportButton';

const StatusBadge = ({ status }) => {
  const { t } = useTranslation('common');
  const statusColors = {
    Active: 'text-green-800 bg-green-100',
    'On Leave': 'text-yellow-800 bg-yellow-100',
    Inactive: 'text-red-800 bg-red-100',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full bg-neo-bg shadow-neo-md ${statusColors[status] || 'bg-gray-100'}`}>
      {t(status)}
    </span>
  );
};

export default function StaffTable({ onEdit, onDelete }) {
  const { t } = useTranslation('common');
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const staffList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaff(staffList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching staff:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const csvHeaders = [
    { label: "Staff ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Join Date", key: "joinDate" },
  ];

  if (isLoading) {
    return <div className="text-center text-gray-500 py-10">Loading staff...</div>;
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">{t('StaffDirectory')}</h2>
        <ExportButton data={staff} headers={csvHeaders} filename="staff_directory.csv" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><User className="inline w-4 h-4 mr-1"/>{t('FullName')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><Mail className="inline w-4 h-4 mr-1"/>Email</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><Shield className="inline w-4 h-4 mr-1"/>{t('Role')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><Calendar className="inline w-4 h-4 mr-1"/>{t('JoinDate')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Status')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-t border-neo-dark/20">
                <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-800">{member.name}</td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">{member.email || 'N/A'}</td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.joinDate ? formatDate(member.joinDate.toDate()) : 'N/A'}
                </td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                  <StatusBadge status={'Active'} />
                </td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <NeumorphismButton onClick={() => onEdit(member)} className="!w-auto !p-2 !rounded-full !text-blue-600">
                        <Edit className="w-4 h-4"/>
                    </NeumorphismButton>
                    <NeumorphismButton onClick={() => onDelete(member)} className="!w-auto !p-2 !rounded-full !text-red-600">
                        <Trash2 className="w-4 h-4"/>
                    </NeumorphismButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
