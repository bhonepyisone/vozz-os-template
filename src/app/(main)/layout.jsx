// FILE: src/app/(main)/layout.jsx

'use client';

import { useState, useEffect } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useWindowSize } from '@/lib/hooks';

export default function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const size = useWindowSize();
  const isMobile = size.width ? size.width < 768 : false;

  useEffect(() => {
    if (!isMobile) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="flex h-screen bg-neo-bg">
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        isMobileNavOpen={isMobileNavOpen}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${!isMobile && (isCollapsed ? 'ml-20' : 'ml-64')}`}>
        <Navbar toggleMobileNav={toggleMobileNav} isMobile={isMobile} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      {isMobile && isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleMobileNav}
        ></div>
      )}
    </div>
  );
}
