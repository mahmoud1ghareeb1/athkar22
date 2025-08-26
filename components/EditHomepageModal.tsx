import React from 'react';
import { useHomepageSettings, HomepageSection } from '../hooks/useHomepageSettings';
import { CloseIcon, CheckIcon } from './Icons';

interface EditHomepageModalProps {
    settings: ReturnType<typeof useHomepageSettings>['settings'];
    onToggle: (key: HomepageSection) => void;
    onClose: () => void;
}

const sectionLabels: Record<HomepageSection, string> = {
    continueReading: 'متابعة القراءة',
    khatma: 'ختمة',
    habitTracker: 'متعقب العادة',
    ayah: 'آية اليوم',
    hadith: 'حديث اليوم',
    dua: 'دعاء اليوم',
    asmaulhusna: 'أسماء الله الحسنى',
    shortcuts: 'الاختصارات',
    dailyQuestion: 'سؤال اليوم',
};

const EditHomepageModal: React.FC<EditHomepageModalProps> = ({ settings, onToggle, onClose }) => {

    const ToggleRow: React.FC<{ sectionKey: HomepageSection }> = ({ sectionKey }) => (
        <div 
            className="flex items-center justify-between p-4 cursor-pointer bg-gray-700 rounded-lg"
            onClick={() => onToggle(sectionKey)}
        >
            <h3 className="text-lg font-semibold text-gray-200">{sectionLabels[sectionKey]}</h3>
            <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${settings[sectionKey] ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                {settings[sectionKey] && <CheckIcon className="w-4 h-4 text-white" />}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl flex flex-col overflow-hidden animate-fade-in-up border border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-green-400">تعديل الصفحة الرئيسية</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-3">
                    {Object.keys(sectionLabels).map(key => (
                        <ToggleRow key={key} sectionKey={key as HomepageSection} />
                    ))}
                </div>
                
                <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                     <button onClick={onClose} className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                        حفظ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditHomepageModal;