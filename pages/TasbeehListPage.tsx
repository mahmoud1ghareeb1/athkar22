import React, { useState } from 'react';
import Header from '../components/Header';
import AddTasbeehModal from '../components/AddTasbeehModal';
import TasbeehCounterPage from './TasbeehCounterPage';
import { useTasbeeh } from '../hooks/useTasbeeh';
import type { TasbeehItem } from '../types';

interface TasbeehListPageProps {
  onClose: () => void;
}

const TasbeehListPage: React.FC<TasbeehListPageProps> = ({ onClose }) => {
    const { tasbeehList, addTasbeeh, updateTasbeehTotal } = useTasbeeh();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedTasbeeh, setSelectedTasbeeh] = useState<TasbeehItem | null>(null);

    const handleSelectTasbeeh = (item: TasbeehItem) => {
        setSelectedTasbeeh(item);
    };

    const handleCounterClose = (currentTotal: number) => {
        if (selectedTasbeeh) {
            updateTasbeehTotal(selectedTasbeeh.id, currentTotal);
        }
        setSelectedTasbeeh(null);
    };
    
    if (selectedTasbeeh) {
        return (
            <TasbeehCounterPage 
                tasbeehItem={selectedTasbeeh}
                onClose={handleCounterClose}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="المسبحة الالكترونية" onBack={onClose} showSettings={false} />
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {tasbeehList.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => handleSelectTasbeeh(item)}
                        className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer transition hover:shadow-lg hover:bg-green-900/50"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-200">{item.text}</h3>
                            <span className="text-xs text-gray-500">...</span>
                        </div>
                        <div className="flex justify-between items-baseline mt-2 text-sm">
                            <p className="text-gray-400">
                                {item.benefit}: <span className="font-semibold text-green-400">{item.targetCount}</span>
                            </p>
                            <p className="text-gray-400">
                                عدد المرات الاجمالي: <span className="font-semibold text-green-400">{item.totalCount}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-4xl font-light hover:bg-green-700 transform hover:scale-110 transition-all"
            >
                +
            </button>
            {isAddModalOpen && (
                <AddTasbeehModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={(item) => {
                        addTasbeeh(item);
                        setIsAddModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default TasbeehListPage;