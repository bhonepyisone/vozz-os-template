// FILE: src/components/hrm/StaffTable.jsx

'use client';

import { User, Mail, Shield } from 'lucide-react';

// Placeholder data - this will come from your 'users' collection in Firestore
const staff = [
  { id: 'STAFF-001', name: 'Admin User', email: 'admin@vozz.com', role: 'Admin', status: 'Active' },
  { id: 'STAFF-002', name: 'Manager Mike', email: 'manager@vozz.com', role: 'Management', status: 'Active' },
  { id: 'STAFF-007', name: 'Jane Doe', email: 'jane.d@vozz.com', role: 'Front Desk', status: 'Active' },
  { id: 'STAFF-008', name: 'John Smith', email: 'john.s@vozz.com', role: 'Staff', status: 'On Leave' },
  { id: 'STAFF-009', name: 'Peter Jones', email: 'peter.j@vozz.com', role: 'Staff', status: 'Inactive' },
];

const StatusBadge = ({ status }) => {
  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

export default function StaffTable() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Directory</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><User className="inline w-4 h-4 mr-1"/>Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><Mail className="inline w-4 h-4 mr-1"/>Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><Shield className="inline w-4 h-4 mr-1"/>Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <StatusBadge status={member.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}