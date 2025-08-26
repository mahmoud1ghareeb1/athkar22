import React, { useState } from 'react';
import Header from '../components/Header';
import { feelings, feelingsDuas } from '../data/feelings-data';
import type { Zikr } from '../types';

interface FeelingPageProps {
  onClose: () => void;
}

// Re-using ZikrCard styling from AthkarPage
const ZikrCard: React.FC<{ zikr: Zikr }> = ({ zikr }) => {
    const [count, setCount] = useState(zikr.count);
    const handleClick = () => {
        if (count > 0) setCount(prev => prev - 1);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <p className="text-lg leading-relaxed text-gray-300 text-right mb-4 whitespace-pre-wrap">{zikr.text}</p>
            {zikr.reference && <p className="text-sm text-gray-500 mb-4 text-left">{zikr.reference}</p>}
            <button
                onClick={handleClick}
                disabled={count === 0}
                className={`w-full py-2 rounded-lg text-white font-bold text-xl transition ${
                    count > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 cursor-not-allowed'
                }`}
            >
                {count}
            </button>
        </div>
    );
};

const FeelingPage: React.FC<FeelingPageProps> = ({ onClose }) => {
    const [selectedFeelingId, setSelectedFeelingId] = useState<string>(feelings[0].id);

    const selectedFeeling = feelings.find(f => f.id === selectedFeelingId);
    const duas = feelingsDuas[selectedFeelingId] || [];

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="بماذا تشعر؟" onBack={onClose} showSettings={false} />
            <div className="flex-grow overflow-y-auto p-4">
                <div className="relative mb-6">
                    <select
                        value={selectedFeelingId}
                        onChange={(e) => setSelectedFeelingId(e.target.value)}
                        className="w-full appearance-none bg-gray-800 p-4 rounded-lg shadow-md text-lg font-semibold text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
                    >
                        {feelings.map(feeling => (
                            <option key={feeling.id} value={feeling.id} className="bg-gray-800 text-gray-200">
                                {feeling.emoji} {feeling.name}
                            </option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                
                <div>
                    {duas.length > 0 ? (
                        duas.map(dua => <ZikrCard key={dua.id} zikr={dua} />)
                    ) : (
                         <div className="text-center text-gray-500 mt-8">
                             <p>لم نجد أذكارًا مخصصة لهذا الشعور بعد. حاول اختيار شعور آخر.</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeelingPage;