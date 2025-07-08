// FILE: src/app/admin/page.jsx

'use client';

import Link from 'next/link';
import { Building, Users, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  const adminCards = [
    {
      href: '/admin/shops',
      title: 'Shop Management',
      description: 'Create, view, and manage all shop accounts in the system.',
      icon: <Building className="w-8 h-8 text-primary" />,
    },
    {
      href: '/admin/users',
      title: 'User Management',
      description: 'Pre-register new users, assign roles, and manage user access.',
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      href: '/admin/system',
      title: 'System Settings',
      description: 'Configure system-wide settings and security policies.',
      icon: <Settings className="w-8 h-8 text-primary" />,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <div className="bg-gray-700 p-6 rounded-2xl shadow-lg h-full flex flex-col justify-between hover:bg-gray-600 transition-colors cursor-pointer">
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  {card.icon}
                  <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                </div>
                <p className="text-gray-300">
                  {card.description}
                </p>
              </div>
              <div className="text-right mt-4 text-sm font-semibold text-primary hover:underline">
                Go to {card.title} &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
