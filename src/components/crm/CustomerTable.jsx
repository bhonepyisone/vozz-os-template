'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { User, Mail, ShoppingBag, Star, Edit } from 'lucide-react';
import Card from '@/components/ui/Card';
import ExportButton from '@/components/ui/ExportButton';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

const TierBadge = ({ tier }) => {
  const { t } = useTranslation('common');
  const tierColors = {
    Gold: 'text-yellow-600',
    Silver: 'text-gray-600',
    Bronze: 'text-orange-700',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full bg-neo-bg shadow-neo-md ${tierColors[tier] || 'text-gray-500'}`}>
      {t(tier)}
    </span>
  );
};

export default function CustomerTable({ onEdit }) {
  const { t } = useTranslation('common');
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customersCollection = collection(db, 'customers');
    
    const unsubscribe = onSnapshot(customersCollection, (snapshot) => {
      const customerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(customerList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const csvHeaders = [
    { label: "Customer ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Total Spend", key: "totalSpend" },
    { label: "Tier", key: "tier" },
  ];

  if (isLoading) {
    return <div className="text-center text-gray-500 py-10">Loading customers...</div>;
  }

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">{t('CustomerList')}</h2>
            <ExportButton data={customers} headers={csvHeaders} filename="customers.csv">
              {t('ExportToCSV')}
            </ExportButton>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><User className="inline w-4 h-4 mr-1"/>{t('FullName')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><Mail className="inline w-4 h-4 mr-1"/>Email</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><ShoppingBag className="inline w-4 h-4 mr-1"/>{t('TotalSpend')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase"><Star className="inline w-4 h-4 mr-1"/>{t('LoyaltyTier')}</th>
              <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-neo-dark/20">
                <td className="py-4 whitespace-nowrap text-sm font-medium text-gray-800">{customer.name}</td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">{customer.totalSpend?.toLocaleString()}</td>
                <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                  <TierBadge tier={customer.tier} />
                </td>
                <td className="py-4 whitespace-nowrap text-sm">
                    <NeumorphismButton onClick={() => onEdit(customer)} className="!w-auto !p-2 !rounded-full !text-blue-600">
                        <Edit className="w-4 h-4" />
                    </NeumorphismButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
