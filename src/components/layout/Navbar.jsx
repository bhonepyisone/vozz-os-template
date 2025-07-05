// FILE: src/components/layout/Navbar.jsx

'use client';

import { Search, Bell, UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* User Menu */}
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-500 hover:text-primary">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center space-x-2">
           <UserCircle className="w-10 h-10 text-gray-400" />
           <div>
             <p className="text-sm font-semibold text-gray-800">Admin User</p>
             <p className="text-xs text-gray-500">Administrator</p>
           </div>
        </div>
      </div>
    </header>
  );
}