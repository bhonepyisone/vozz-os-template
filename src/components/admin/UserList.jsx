// FILE: src/components/admin/UserList.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Loader2, User, Shield, Building, Edit, Trash2 } from 'lucide-react';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function UserList({ onEdit, onDelete }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">All System Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Staff ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Shop ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.shopId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                        <NeumorphismButton onClick={() => onEdit(user)} className="!w-auto !p-2 !rounded-full !text-blue-400">
                            <Edit className="w-4 h-4"/>
                        </NeumorphismButton>
                        <NeumorphismButton onClick={() => onDelete(user)} className="!w-auto !p-2 !rounded-full !text-red-400">
                            <Trash2 className="w-4 h-4"/>
                        </NeumorphismButton>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
