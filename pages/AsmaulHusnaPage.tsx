import React, { useState } from 'react';
import Header from '../components/Header';
import { asmaulHusnaData } from '../data/asma-ul-husna';
import { ChevronDownIcon } from '../components/Icons';

interface AsmaulHusnaPageProps {
  onClose: () => void;
}

const AsmaulHusnaPage: React.FC<AsmaulHusnaPageProps> = ({ onClose }) => {
  const [expandedName, setExpandedName] = useState<string | null>(null);

  const toggleName = (name: string) => {
    setExpandedName(expandedName === name ? null : name);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
      <Header title="أسماء الله الحسنى" onBack={onClose} showSettings={false} />
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {asmaulHusnaData.map((nameData) => (
          <div key={nameData.name} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleName(nameData.name)}
              className="w-full p-4 flex justify-between items-center text-right"
            >
              <div>
                <h3 className="text-xl font-bold text-green-400">{nameData.name}</h3>
                <p className="text-md text-gray-400">{nameData.transliteration} - {nameData.meaning}</p>
              </div>
              <ChevronDownIcon
                className={`w-6 h-6 text-gray-400 transition-transform ${
                  expandedName === nameData.name ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedName === nameData.name && (
              <div className="p-4 pt-0">
                <p className="text-gray-300 leading-relaxed bg-gray-700/50 p-3 rounded-md border-r-4 border-green-500">
                  {nameData.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AsmaulHusnaPage;