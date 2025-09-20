import React, { useState, useEffect } from 'react';
import React, { useEffect, useState } from 'react';
import { getTafsir } from '../services/quranApi';
import type { Ayah, Tafsir } from '../types';
import { CloseIcon } from './Icons';

interface TafsirModalProps {
    ayah: Ayah;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

const TafsirModal: React.FC<TafsirModalProps> = ({ ayah, onClose, onPrev, onNext }) => {
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
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in" onClick={onClose}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 sticky top-0" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h2 className="text-lg font-bold text-green-400">تفسير السعدي</h2>
                    <p className="text-sm text-gray-400">{`سورة ${ayah.surah.name} - الآية ${ayah.numberInSurah}`}</p>
                </div>
                <button onClick={onClose} className="text-gray-300 hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="px-4 pt-4 pb-2 bg-gray-900 border-b border-gray-800" onClick={(e) => e.stopPropagation()}>
                <p className="font-amiri-quran text-gray-100 text-2xl leading-relaxed text-center">{ayah.text}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-900" dir="rtl" onClick={(e) => e.stopPropagation()}>
                {loading && <p className="text-center text-gray-400">جاري تحميل التفسير...</p>}
                {error && <p className="text-center text-red-400">{error}</p>}
                {tafsir && (
                    <p className="text-gray-300 leading-loose text-right whitespace-pre-wrap">{tafsir.text}</p>
                )}
            </div>

            <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center justify-between sticky bottom-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={onPrev} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-green-400 rounded-lg font-semibold transition">الآية السابقة</button>
                <button onClick={onNext} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">الآية التالية</button>
            </div>
        </div>
    );
};

export default TafsirModal;
