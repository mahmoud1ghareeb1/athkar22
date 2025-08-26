
import { useState, useCallback, useEffect } from 'react';

const KHATMA_KEY = 'khatma_progress_ayah';
export const TOTAL_AYAH_COUNT = 6236;

export const useKhatmaProgress = () => {
    const [currentAyah, setCurrentAyah] = useState<number>(1);

    useEffect(() => {
        try {
            const storedAyah = localStorage.getItem(KHATMA_KEY);
            if (storedAyah) {
                const ayahNum = parseInt(storedAyah, 10);
                if (ayahNum > 0 && ayahNum <= TOTAL_AYAH_COUNT) {
                    setCurrentAyah(ayahNum);
                }
            }
        } catch (error) {
            console.error("Failed to parse Khatma progress from localStorage", error);
        }
    }, []);

    const saveProgress = useCallback((ayahNumber: number) => {
        try {
            localStorage.setItem(KHATMA_KEY, String(ayahNumber));
            setCurrentAyah(ayahNumber);
        } catch (error) {
            console.error("Failed to save Khatma progress to localStorage", error);
        }
    }, []);

    return { currentAyah, saveProgress };
};
