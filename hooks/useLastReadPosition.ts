import { useState, useCallback, useEffect } from 'react';
import type { LastReadPosition } from '../types';

const LAST_READ_KEY = 'quran_last_read_v1';

export const useLastReadPosition = () => {
    const [lastRead, setLastRead] = useState<LastReadPosition | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LAST_READ_KEY);
            if (stored) {
                setLastRead(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load last read position from localStorage", error);
        }
    }, []);

    const saveLastReadPosition = useCallback((position: LastReadPosition) => {
        try {
            localStorage.setItem(LAST_READ_KEY, JSON.stringify(position));
            setLastRead(position);
        } catch (error) {
            console.error("Failed to save last read position to localStorage", error);
        }
    }, []);
    
    const clearLastReadPosition = useCallback(() => {
        try {
            localStorage.removeItem(LAST_READ_KEY);
            setLastRead(null);
        } catch (error)
        {
            console.error("Failed to clear last read position from localStorage", error);
        }
    }, []);

    return { lastRead, saveLastReadPosition, clearLastReadPosition };
};