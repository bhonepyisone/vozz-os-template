// FILE: src/components/layout/Sidebar.jsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  BookOpen,
  Boxes,
  CalendarCheck,
  Heart,
  Users,
  Banknote,
  BarChart2,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pos', label: 'POS', icon: ShoppingCart },
  { href: '/menu', label: 'Menu', icon: BookOpen },
  { href: '/inventory', label: 'Inventory', icon: Boxes },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/crm', label: 'CRM', icon: Heart },
  { href: '/hrm', label: 'HRM', icon: Users },
  { href: '/financials', label: 'Financials', icon: Banknote },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/admin/shops', label: 'Shop Management', icon: Boxes },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/system', label: 'System Settings', icon: Settings },
]

export default function Sidebar({ isAdmin = false }) {
  const pathname = usePathname();
  const links = isAdmin ? adminLinks : navLinks;
  const bgColor = isAdmin ? 'bg-gray-800' : 'bg-sidebar-bg';
  const textColor = isAdmin ? 'text-gray-200' : 'text-sidebar-text';
  const hoverBg = isAdmin ? 'hover:bg-gray-700' : 'hover:bg-gray-700';
  const activeBg = isAdmin ? 'bg-primary' : 'bg-primary';

  return (
    <aside className={`w-64 ${bgColor} text-white flex flex-col`}>
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
         <Image 
          src="/assets/images/logo.png"
          alt="Vozz OS Logo"
          width={40}
          height={40}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/ffffff/1F2937?text=V'; }}
        />
        <h1 className="text-xl font-bold ml-2">Vozz OS</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href) && (link.href !== '/dashboard' || pathname === '/dashboard');
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${textColor} ${hoverBg} ${
                isActive ? `${activeBg} text-white` : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="ml-4 text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <button className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-colors duration-200 ${textColor} ${hoverBg}`}>
          <LogOut className="w-5 h-5" />
          <span className="ml-4 text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}