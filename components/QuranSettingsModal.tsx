import React from 'react';
import type { Reciter } from '../types';
import { reciters } from '../constants';
import { CloseIcon, CheckIcon } from './Icons';

interface QuranSettings {
    fontSize: number;
    reciter: Reciter;
}

interface QuranSettingsModalProps {
    settings: QuranSettings;
    onClose: () => void;
    onFontSizeChange: (size: number) => void;
    onReciterChange: (reciter: Reciter) => void;
}

const QuranSettingsModal: React.FC<QuranSettingsModalProps> = ({ settings, onClose, onFontSizeChange, onReciterChange }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl flex flex-col overflow-hidden animate-fade-in-up border border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-green-400">إعدادات المصحف</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Font Size */}
                    <div>
                        <label htmlFor="font-size" className="block text-md font-medium text-gray-300 mb-2">
                            حجم الخط: <span className="text-green-400 font-bold">{settings.fontSize}px</span>
                        </label>
                        <input
                            id="font-size"
                            type="range"
                            min="16"
                            max="64"
                            step="2"
                            value={settings.fontSize}
                            onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Reciter Selection */}
                    <div>
                        <label className="block text-md font-medium text-gray-300 mb-2">
                            القارئ
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {reciters.map(r => (
                                <button
                                    key={r.identifier}
                                    onClick={() => onReciterChange(r)}
                                    className={`w-full text-right p-3 rounded-lg flex justify-between items-center transition ${settings.reciter.identifier === r.identifier ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                                >
                                    <span>{r.name}</span>
                                    {settings.reciter.identifier === r.identifier && <CheckIcon className="w-5 h-5 text-green-400"/>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                     <button onClick={onClose} className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                        تم
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuranSettingsModal;