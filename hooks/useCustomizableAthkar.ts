import { useState, useCallback, useEffect } from 'react';
import type { Zikr } from '../types';
import { athkarData } from '../constants';

const CUSTOM_ATHKAR_PREFIX = 'custom_athkar_';

export const useCustomizableAthkar = (categoryId: string) => {
    const [athkar, setAthkar] = useState<Zikr[]>([]);
    const storageKey = `${CUSTOM_ATHKAR_PREFIX}${categoryId}`;

    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                setAthkar(JSON.parse(stored));
            } else {
                const defaultAthkar = athkarData[categoryId] || [];
                // Give each zikr a more unique ID if it doesn't have one
                const initializedAthkar = defaultAthkar.map((zikr, index) => ({
                    ...zikr,
                    id: `${categoryId}-${zikr.id || index}`
                }));
                localStorage.setItem(storageKey, JSON.stringify(initializedAthkar));
                setAthkar(initializedAthkar);
            }
        } catch (error) {
            console.error(`Failed to load athkar for ${categoryId}`, error);
            setAthkar(athkarData[categoryId] || []);
        }
    }, [categoryId, storageKey]);

    const saveAthkar = useCallback((newAthkar: Zikr[]) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(newAthkar));
            setAthkar(newAthkar);
        } catch (error) {
            console.error(`Failed to save athkar for ${categoryId}`, error);
        }
    }, [storageKey]);

    const addZikr = useCallback((zikrData: Omit<Zikr, 'id' | 'category'>) => {
        const newZikr: Zikr = {
            ...zikrData,
            id: new Date().toISOString(),
            category: categoryId,
        };
        saveAthkar([...athkar, newZikr]);
    }, [athkar, categoryId, saveAthkar]);

    const updateZikr = useCallback((updatedZikr: Zikr) => {
        const newAthkar = athkar.map(z => z.id === updatedZikr.id ? updatedZikr : z);
        saveAthkar(newAthkar);
    }, [athkar, saveAthkar]);

    const deleteZikr = useCallback((zikrId: number | string) => {
        const newAthkar = athkar.filter(z => z.id !== zikrId);
        saveAthkar(newAthkar);
    }, [athkar, saveAthkar]);

    return { athkar, addZikr, updateZikr, deleteZikr };
};
