import React from 'react';
import { UserIcon, AdjustmentsIcon, ArrowLeftIcon } from './Icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, showSettings = true, onSettingsClick, children, actions }) => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 p-4 flex justify-between items-center shadow-md">
      {onBack ? (
        <button onClick={onBack} className="text-gray-300 p-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-10 h-10"></div> // Placeholder for alignment
      )}
      {children || <h1 className="text-xl font-bold text-green-400">{title}</h1>}
      <div className="flex items-center space-x-2">
        {actions}
        {showSettings ? (
          <button onClick={onSettingsClick} className="text-gray-300 p-2">
            <AdjustmentsIcon className="w-7 h-7" />
          </button>
        ) : (
          <div className="w-10 h-10"></div> // Placeholder for alignment
        )}
      </div>
    </header>
  );
};

export default Header;