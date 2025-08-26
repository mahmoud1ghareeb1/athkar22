import { useState, useCallback, useEffect } from 'react';
import type { Reciter } from '../types';
import { reciters } from '../constants';

const SETTINGS_KEY = 'quran_settings_v1';

interface QuranSettings {
    fontSize: number;
    reciter: Reciter;
}

const defaultSettings: QuranSettings = {
    fontSize: 28,
    reciter: reciters[0],
};

export const useQuranSettings = () => {
    const [settings, setSettings] = useState<QuranSettings>(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Ensure reciter object is valid
                if (reciters.find(r => r.identifier === parsed.reciter.identifier)) {
                    return parsed;
                }
            }
            return defaultSettings;
        } catch (error) {
            console.error("Failed to load Quran settings from localStorage", error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save Quran settings to localStorage", error);
        }
    }, [settings]);

    const setFontSize = useCallback((size: number) => {
        setSettings(s => ({ ...s, fontSize: Math.max(16, Math.min(size, 64)) }));
    }, []);

    const setReciter = useCallback((reciter: Reciter) => {
        setSettings(s => ({ ...s, reciter }));
    }, []);

    return { settings, setFontSize, setReciter };
};
