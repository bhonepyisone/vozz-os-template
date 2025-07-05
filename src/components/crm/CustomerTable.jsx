// FILE: src/components/crm/CustomerTable.jsx

'use client';

import { User, Mail, ShoppingBag, Star } from 'lucide-react';

// Placeholder data - this will come from your Firestore 'customers' collection
const customers = [
  { id: 'CUST-001', name: 'John Smith', email: 'john.s@example.com', totalSpend: 52500, tier: 'Gold' },
  { id: 'CUST-002', name: 'Jane Doe', email: 'jane.d@example.com', totalSpend: 28000, tier: 'Silver' },
  { id: 'CUST-003', name: 'Peter Jones', email: 'peter.j@example.com', totalSpend: 15000, tier: 'Bronze' },
  { id: 'CUST-004', name: 'Mary Johnson', email: 'mary.j@example.com', totalSpend: 61000, tier: 'Gold' },
  { id: 'CUST-005', name: 'David Williams', email: 'david.w@example.com', totalSpend: 8500, tier: 'Bronze' },
];

const TierBadge = ({ tier }) => {
  const tierColors = {
    Gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Silver: 'bg-gray-200 text-gray-800 border-gray-300',
    Bronze: 'bg-orange-100 text-orange-800 border-orange-300',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${tierColors[tier] || 'bg-gray-100'}`}>
      {tier}
    </span>
  );
};

export default function CustomerTable() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><User className="inline w-4 h-4 mr-1"/>Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><Mail className="inline w-4 h-4 mr-1"/>Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><ShoppingBag className="inline w-4 h-4 mr-1"/>Total Spend</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><Star className="inline w-4 h-4 mr-1"/>Loyalty Tier</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.totalSpend.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <TierBadge tier={customer.tier} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
