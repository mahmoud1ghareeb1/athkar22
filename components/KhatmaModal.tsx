import React, { useState, useEffect } from 'react';
import { getAyah } from '../services/quranApi';
import { useKhatmaProgress, TOTAL_AYAH_COUNT } from '../hooks/useKhatmaProgress';
import type { Ayah } from '../types';

interface KhatmaModalProps {
    onClose: () => void;
}

const KhatmaModal: React.FC<KhatmaModalProps> = ({ onClose }) => {
    const { currentAyah: initialAyah, saveProgress } = useKhatmaProgress();
    const [ayahData, setAyahData] = useState<Ayah | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentAyahNumber, setCurrentAyahNumber] = useState(initialAyah);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const fetchAyahData = async () => {
            if (currentAyahNumber > TOTAL_AYAH_COUNT) {
                setIsFinished(true);
                return;
            }
            setIsLoading(true);
            try {
                const data = await getAyah(currentAyahNumber);
                setAyahData(data);
            } catch (error) {
                console.error("Failed to fetch ayah for Khatma modal", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAyahData();
    }, [currentAyahNumber]);

    const handleNext = () => {
        if (currentAyahNumber < TOTAL_AYAH_COUNT) {
            setCurrentAyahNumber(prev => prev + 1);
        } else {
             setIsFinished(true);
        }
    };

    const handlePrevious = () => {
        if (currentAyahNumber > 1) {
            setCurrentAyahNumber(prev => prev - 1);
        }
    };

    const handleDone = () => {
        saveProgress(currentAyahNumber);
        onClose();
    };

    const handleFinish = () => {
        saveProgress(1); // Reset for next Khatma
        onClose();
    };
    
    const renderContent = () => {
        if (isFinished) {
            return (
                 <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 تهانينا! 🎉</h2>
                    <p className="text-lg text-gray-300">لقد أتممت ختمة القرآن الكريم. تقبل الله منك صالح الأعمال.</p>
                    <button 
                        onClick={handleFinish}
                        className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        ابدأ ختمة جديدة
                    </button>
                </div>
            );
        }

        if (isLoading) {
            return <div className="p-8 text-center text-gray-400">جاري تحميل الآية...</div>
        }

        if (!ayahData) {
            return <div className="p-8 text-center text-red-400">حدث خطأ في تحميل الآية.</div>
        }

        return (
            <>
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-400 mb-2">{`سورة ${ayahData.surah.name} - الآية ${ayahData.numberInSurah}`}</p>
                    <p className="text-2xl font-amiri-quran leading-relaxed text-gray-200">{ayahData.text}</p>
                </div>
                <div className="px-4 pb-4">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevious} disabled={currentAyahNumber <= 1} className="px-6 py-2 bg-gray-700 rounded-lg disabled:opacity-50 text-gray-200">السابق</button>
                        <span className="text-gray-300 font-semibold">{currentAyahNumber} / {TOTAL_AYAH_COUNT}</span>
                        <button onClick={handleNext} className="px-6 py-2 bg-gray-700 rounded-lg text-gray-200">التالي</button>
                    </div>
                    <button 
                        onClick={handleDone}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        تم
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl flex flex-col overflow-hidden animate-fade-in-up border border-gray-700">
               {renderContent()}
            </div>
        </div>
    );
};

export default KhatmaModal;