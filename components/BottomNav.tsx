
import React from 'react';
import { HomeIcon, BookOpenIcon, QuranIcon, BellIcon, DotsCircleIcon } from './Icons';
import type { Page } from '../types';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: HomeIcon },
    { id: 'athkar', label: 'أذكار المسلم', icon: BookOpenIcon },
    { id: 'quran', label: 'القرآن', icon: QuranIcon },
    { id: 'messages', label: 'رسائل', icon: BellIcon },
    { id: 'more', label: 'المزيد', icon: DotsCircleIcon },
  ];

  return (
    <div className="fixed bottom-0 right-0 left-0 bg-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] border-t border-gray-700">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id as Page)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
              activePage === item.id ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
