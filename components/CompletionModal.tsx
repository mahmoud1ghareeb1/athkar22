import React from 'react';
import { CheckIcon } from './Icons';

interface CompletionModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl flex flex-col items-center p-6 animate-fade-in-up border border-gray-700 text-center">
        {/* TODO: Add confetti/stars animation with CSS */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 border-4 border-gray-700">
            <CheckIcon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-green-400 mb-2">{title}</h2>
        <p className="text-lg text-gray-300 mb-6">{message}</p>
        <button 
            onClick={onClose}
            className="px-8 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition font-semibold"
        >
            تم
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;
