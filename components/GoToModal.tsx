import React, { useState, useEffect } from 'react';
import { surahList } from '../constants';
import type { Surah } from '../types';

interface GoToModalProps {
    onClose: () => void;
    onNavigate: (page: number, ayahNumberOverall?: number) => void;
    findPageForSurahAyah: (surahNumber: number, ayahInSurah: number) => { page: number; ayahNumberOverall: number } | null;
}

const GoToModal: React.FC<GoToModalProps> = ({ onClose, onNavigate, findPageForSurahAyah }) => {
    const [mode, setMode] = useState<'surah' | 'page'>('surah');
    const [selectedSurah, setSelectedSurah] = useState<Surah>(surahList[0]);
    const [ayahNumber, setAyahNumber] = useState('');
    const [pageNumber, setPageNumber] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Reset ayah number and error when surah changes
        setAyahNumber('');
        setError('');
    }, [selectedSurah]);

    const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const surah = surahList.find(s => s.number === parseInt(e.target.value, 10));
        if (surah) {
            setSelectedSurah(surah);
        }
    };
    
    const handleNavigateSurah = () => {
        setError('');
        const ayahNum = parseInt(ayahNumber, 10);
        if (isNaN(ayahNum) || ayahNum < 1 || ayahNum > selectedSurah.numberOfAyahs) {
            setError(`الرجاء إدخال رقم آية صحيح لسورة ${selectedSurah.name} (1-${selectedSurah.numberOfAyahs})`);
            return;
        }
        const result = findPageForSurahAyah(selectedSurah.number, ayahNum);
        if (result) {
            onNavigate(result.page, result.ayahNumberOverall);
            onClose();
        } else {
            setError('لم نتمكن من العثور على هذه الآية.');
        }
    };
    
    const handleNavigatePage = () => {
        setError('');
        const pageNum = parseInt(pageNumber, 10);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
             setError('الرجاء إدخال رقم صفحة صحيح (1-604)');
             return;
        }
        onNavigate(pageNum);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl flex flex-col animate-fade-in-up border border-gray-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center text-green-400 p-4 border-b border-gray-700">الانتقال إلى</h2>
                
                {/* Tabs */}
                <div className="flex bg-gray-700">
                    <button onClick={() => setMode('surah')} className={`w-1/2 py-3 font-semibold ${mode === 'surah' ? 'bg-green-600 text-white' : 'text-gray-300'}`}>سورة / آية</button>
                    <button onClick={() => setMode('page')} className={`w-1/2 py-3 font-semibold ${mode === 'page' ? 'bg-green-600 text-white' : 'text-gray-300'}`}>صفحة</button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {mode === 'surah' ? (
                        <>
                            <div>
                                <label htmlFor="surah-select" className="block text-sm font-medium text-gray-300 mb-1">السورة</label>
                                <select id="surah-select" value={selectedSurah.number} onChange={handleSurahChange} className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500">
                                    {surahList.map(surah => (
                                        <option key={surah.number} value={surah.number}>{surah.number}. {surah.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="ayah-number" className="block text-sm font-medium text-gray-300 mb-1">رقم الآية</label>
                                <input
                                    type="number"
                                    id="ayah-number"
                                    value={ayahNumber}
                                    onChange={(e) => setAyahNumber(e.target.value)}
                                    placeholder={`1 - ${selectedSurah.numberOfAyahs}`}
                                    className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                            <button onClick={handleNavigateSurah} className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">اذهب</button>
                        </>
                    ) : (
                        <>
                           <div>
                                <label htmlFor="page-number" className="block text-sm font-medium text-gray-300 mb-1">رقم الصفحة</label>
                                <input
                                    type="number"
                                    id="page-number"
                                    value={pageNumber}
                                    onChange={(e) => setPageNumber(e.target.value)}
                                    placeholder="1 - 604"
                                    className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                            </div>
                             <button onClick={handleNavigatePage} className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">اذهب</button>
                        </>
                    )}
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default GoToModal;
