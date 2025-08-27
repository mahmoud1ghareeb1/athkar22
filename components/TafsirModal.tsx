import React, { useState, useEffect } from 'react';
import { getTafsir } from '../services/quranApi';
import type { Ayah, Tafsir } from '../types';
import { CloseIcon } from './Icons';

interface TafsirModalProps {
    ayah: Ayah;
    onClose: () => void;
}

const TafsirModal: React.FC<TafsirModalProps> = ({ ayah, onClose }) => {
    const [tafsir, setTafsir] = useState<Tafsir | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTafsir = async () => {
            setLoading(true);
            setError(null);
            try {
                const tafsirData = await getTafsir(ayah.surah.number, ayah.numberInSurah);
                if (tafsirData) {
                    setTafsir(tafsirData);
                } else {
                    setError('التفسير لهذه الآية غير متوفر حالياً.');
                }
            } catch (err) {
                setError('فشل في تحميل التفسير.');
            } finally {
                setLoading(false);
            }
        };

        fetchTafsir();
    }, [ayah]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl w-full max-w-lg h-[80vh] shadow-xl flex flex-col animate-fade-in-up border border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-green-400">تفسير ابن كثير</h2>
                        <p className="text-sm text-gray-400">{`سورة ${ayah.surah.name} - الآية ${ayah.numberInSurah}`}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto" dir="rtl">
                    {loading && <p className="text-center text-gray-400">جاري تحميل التفسير...</p>}
                    {error && <p className="text-center text-red-400">{error}</p>}
                    {tafsir && (
                        <div 
                            className="prose prose-invert text-gray-300 leading-loose text-right"
                            dangerouslySetInnerHTML={{ __html: tafsir.text }} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TafsirModal;
