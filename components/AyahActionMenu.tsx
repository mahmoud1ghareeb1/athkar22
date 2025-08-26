
import React from 'react';
import type { Ayah } from '../types';
import { PlayIcon, BookmarkIcon, BookmarkSolidIcon, InfoIcon, ShareIcon, CloseIcon } from './Icons';

interface AyahActionMenuProps {
  ayah: Ayah | null;
  isBookmarked: boolean;
  onClose: () => void;
  onListen: (ayah: Ayah) => void;
  onBookmark: (ayah: Ayah) => void;
  onTafsir: (ayah: Ayah) => void;
  onShare: (ayah: Ayah) => void;
}

const AyahActionMenu: React.FC<AyahActionMenuProps> = ({ ayah, isBookmarked, onClose, onListen, onBookmark, onTafsir, onShare }) => {
  if (!ayah) return null;

  const handleAction = (action: (ayah: Ayah) => void) => {
    action(ayah);
    onClose();
  };
  
  const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center space-y-2 text-gray-300 hover:text-green-400 transition-colors duration-200">
      <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-30 animate-fade-in" onClick={onClose}></div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl shadow-lg p-4 z-40 animate-slide-up border-t border-gray-700">
        <div className="text-center text-gray-400 mb-4 pb-2 border-b border-gray-700">
            <p className="font-semibold">{`سورة ${ayah.surah.name} - الآية ${ayah.numberInSurah}`}</p>
        </div>
        <div className="grid grid-cols-4 gap-4 py-4">
            <ActionButton icon={<PlayIcon className="w-7 h-7" />} label="استماع" onClick={() => handleAction(onListen)} />
            <ActionButton 
                icon={isBookmarked ? <BookmarkSolidIcon className="w-7 h-7 text-green-400" /> : <BookmarkIcon className="w-7 h-7" />} 
                label={isBookmarked ? "إزالة" : "حفظ"} 
                onClick={() => handleAction(onBookmark)} 
            />
            <ActionButton icon={<InfoIcon className="w-7 h-7" />} label="تفسير" onClick={() => handleAction(onTafsir)} />
            <ActionButton icon={<ShareIcon className="w-7 h-7" />} label="مشاركة" onClick={() => handleAction(onShare)} />
        </div>
      </div>
    </>
  );
};

export default AyahActionMenu;
