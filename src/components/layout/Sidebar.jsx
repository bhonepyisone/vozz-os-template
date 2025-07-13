// FILE: src/components/layout/Sidebar.jsx

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, ShoppingCart, BookOpen, Boxes, CalendarCheck,
  Heart, Users, Banknote, BarChart2, Settings, Shield, LogOut, 
  CalendarClock, ClipboardList, ArrowLeftToLine, ReceiptText, ChevronsLeft, ChevronsRight
} from 'lucide-react';

// Define links for each role
const staffLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/reimbursements', label: 'Reimbursements', icon: ReceiptText },
];

const frontDeskLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pos', label: 'POS', icon: ShoppingCart },
  { href: '/menu', label: 'Menu', icon: BookOpen },
  { href: '/inventory', label: 'Inventory', icon: Boxes },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/crm', label: 'CRM', icon: Heart },
  { href: '/reimbursements', label: 'Reimbursements', icon: ReceiptText },
];

const managementLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pos', label: 'POS', icon: ShoppingCart },
  { href: '/menu', label: 'Menu', icon: BookOpen },
  { href: '/inventory', label: 'Inventory', icon: Boxes },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/crm', label: 'CRM', icon: Heart },
  { href: '/hrm', label: 'HRM', icon: Users },
  { href: '/reimbursements', label: 'Reimbursements', icon: ReceiptText },
  { href: '/financials', label: 'Financials', icon: Banknote },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/admin/shops', label: 'Shop Management', icon: Boxes },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/checklists', label: 'Checklists', icon: ClipboardList },
    { href: '/admin/system', label: 'System Settings', icon: Settings },
]

export default function Sidebar({ isAdmin = false, isCollapsed, toggleSidebar, isMobile, isMobileNavOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { t } = useTranslation('common');
  
  let links = [];
  // Determine which set of links to show based on the user's role
  if (isAdmin) {
      links = adminLinks;
  } else {
      switch (user?.role) {
          case 'Admin':
              links = managementLinks; // Admins see all management links in the main app
              break;
          case 'Management':
              links = managementLinks;
              break;
          case 'Front Desk':
              links = frontDeskLinks;
              break;
          case 'Staff':
              links = staffLinks;
              break;
          default:
              links = []; // No links if role is not defined
              break;
      }
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const sidebarClasses = isMobile 
    ? `fixed top-0 left-0 h-full bg-neo-bg flex flex-col shadow-neo-lg z-20 transition-transform duration-300 ease-in-out ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
    : `relative bg-neo-bg flex flex-col shadow-neo-lg z-10 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-center h-20">
        <h1 className={`text-xl font-bold text-gray-700 ${isCollapsed && !isMobile ? 'hidden' : 'block'}`}>Vozz OS</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-neo-bg shadow-neo-inset-active text-primary' 
                  : 'text-gray-600 hover:text-primary'
              } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className={`ml-4 text-sm font-medium ${isCollapsed && !isMobile ? 'hidden' : 'block'}`}>{t(link.label)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-neo-dark/30 space-y-2">
        {isAdmin && (
          <Link href="/dashboard">
            <div className={`flex items-center w-full px-4 py-2.5 rounded-lg text-green-600 hover:text-primary transition-all duration-200 active:shadow-neo-inset-active ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
              <ArrowLeftToLine className="w-5 h-5" />
              <span className={`ml-4 text-sm font-medium ${isCollapsed && !isMobile ? 'hidden' : 'block'}`}>Return to Dashboard</span>
            </div>
          </Link>
        )}
        <button 
          onClick={handleLogout} 
          className={`flex items-center w-full px-4 py-2.5 rounded-lg text-gray-600 hover:text-primary transition-all duration-200 active:shadow-neo-inset-active ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5" />
          <span className={`ml-4 text-sm font-medium ${isCollapsed && !isMobile ? 'hidden' : 'block'}`}>Logout</span>
        </button>
      </div>
      {!isMobile && (
        <div className="px-4 py-4 border-t border-neo-dark/30">
          <button 
            onClick={toggleSidebar} 
            className="flex items-center justify-center w-full py-2.5 rounded-lg text-gray-600 hover:text-primary transition-all duration-200 active:shadow-neo-inset-active"
          >
            {isCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
          </button>
        </div>
      )}
    </aside>
  );
}

