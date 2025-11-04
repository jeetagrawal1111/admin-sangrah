'use client';

import { Menu, User, LogOut } from 'lucide-react';

export const Header = ({ onMenuToggle, title = 'Aarti Sangrah Admin' }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ml-4 lg:ml-0">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Admin</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};