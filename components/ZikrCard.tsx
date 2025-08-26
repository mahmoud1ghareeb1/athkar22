import React, { useState, useEffect } from 'react';
import type { Zikr } from '../types';
import { PencilIcon, TrashIcon } from './Icons';

interface ZikrCardProps {
  zikr: Zikr;
  onZikrComplete?: (zikrId: string | number) => void;
  // Settings
  fontSize: number;
  vibrateOnZero: boolean;
  countOnPress: boolean;
  // Edit mode
  isEditMode: boolean;
  onEdit: (zikr: Zikr) => void;
  onDelete: (zikrId: string | number) => void;
}

const ZikrCard: React.FC<ZikrCardProps> = ({ zikr, onZikrComplete, fontSize, vibrateOnZero, countOnPress, isEditMode, onEdit, onDelete }) => {
    const [count, setCount] = useState(zikr.count);

    // Sync count if zikr prop changes (e.g., after edit)
    useEffect(() => {
        setCount(zikr.count);
    }, [zikr.count]);

    const handleClick = () => {
        if (count > 0) {
            const newCount = count - 1;
            setCount(newCount);
            if (newCount === 0) {
                if (onZikrComplete) {
                    onZikrComplete(zikr.id);
                }
                if (vibrateOnZero && 'vibrate' in navigator) {
                    navigator.vibrate(200);
                }
            }
        }
    };

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent card click from triggering if a button inside was clicked
        if ((e.target as HTMLElement).closest('button')) return;
        
        if (countOnPress && !isEditMode) {
            handleClick();
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 relative h-full flex flex-col" onClick={handleCardClick}>
            {isEditMode && (
                <div className="absolute top-2 left-2 flex space-x-2 space-x-reverse">
                     <button onClick={() => onEdit(zikr)} className="p-2 bg-blue-800/80 rounded-full text-blue-200 hover:bg-blue-700 z-10">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(zikr.id)} className="p-2 bg-red-800/80 rounded-full text-red-200 hover:bg-red-700 z-10">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
            
            <div className="flex-grow">
                {zikr.description && <p className="text-md text-gray-400 mb-2">{zikr.description}</p>}
                <p 
                    className="text-lg leading-relaxed text-gray-300 text-right mb-4 whitespace-pre-wrap"
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                >
                    {zikr.text}
                </p>
                {zikr.reference && <p className="text-sm text-gray-500 mb-4 text-left">{zikr.reference}</p>}
            </div>
            <button
                onClick={handleClick}
                disabled={count === 0}
                className={`w-full py-2 mt-auto rounded-lg text-white font-bold text-xl transition z-10 relative ${
                    count > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 cursor-not-allowed'
                }`}
            >
                {count}
            </button>
        </div>
    );
};

export default ZikrCard;
