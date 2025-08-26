import React from 'react';

interface ConfirmExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmExitModal: React.FC<ConfirmExitModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl p-6 animate-fade-in-up border border-gray-700 text-center">
        <h2 className="text-xl font-bold text-gray-200 mb-2">لم تنتهي بعد</h2>
        <p className="text-gray-400 mb-6">هل تريد الخروج؟</p>
        <div className="flex justify-around items-center">
           <button 
                onClick={onCancel}
                className="px-8 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition font-semibold"
            >
                تابع القراءة
            </button>
            <button 
                onClick={onConfirm}
                className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-semibold"
            >
                غادر
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmExitModal;
