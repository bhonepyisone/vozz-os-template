// FILE: src/components/layout/Navbar.jsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Bell, UserCircle, Shield, Languages, Menu } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { useTranslation } from 'react-i18next';

const NeumorphismIconButton = ({ children, className = '', ...props }) => (
    <button {...props} className={`w-12 h-12 flex items-center justify-center bg-neo-bg rounded-full shadow-neo-md text-gray-600 hover:text-primary active:shadow-neo-inset transition-all ${className}`}>
        {children}
    </button>
);

export default function Navbar({ toggleMobileNav, isMobile }) {
  const { user } = useAuthStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { i18n } = useTranslation();

  useEffect(() => {
    const notifsRef = collection(db, 'notifications');
    const unsubscribe = onSnapshot(notifsRef, (snapshot) => {
      setNotificationCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="h-20 bg-neo-bg flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <NeumorphismIconButton onClick={toggleMobileNav} className="md:hidden">
            <Menu className="w-6 h-6" />
          </NeumorphismIconButton>
        )}
      </div>
      <div className="flex items-center space-x-2 md:space-x-6">
        <NeumorphismIconButton onClick={changeLanguage} title="Change Language" className="hidden md:flex">
            <Languages className="w-6 h-6" />
        </NeumorphismIconButton>

        {user?.role === 'Admin' && (
          <Link href="/admin">
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-neo-bg rounded-lg shadow-neo-md text-gray-700 font-semibold hover:text-primary active:shadow-neo-inset transition-colors">
              <Shield className="w-5 h-5" />
              <span>Admin Panel</span>
            </button>
          </Link>
        )}

        <div className="relative">
            <NeumorphismIconButton onClick={() => setIsNotifOpen(prev => !prev)}>
                <Bell className="w-6 h-6" />
            </NeumorphismIconButton>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-neo-bg">
                {notificationCount}
              </span>
            )}
            <NotificationPanel isOpen={isNotifOpen} />
        </div>

        <div className="hidden md:flex items-center space-x-3 bg-neo-bg shadow-neo-md p-2 rounded-full">
           <UserCircle className="w-10 h-10 text-gray-400" />
           <div className="pr-2">
             <p className="text-sm font-semibold text-gray-800">{user?.name || 'Guest'}</p>
             <p className="text-xs text-gray-500">{user?.role || 'No Role'}</p>
           </div>
        </div>
      </div>
    </header>
  );
}
