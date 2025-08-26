import { useState, useCallback, useEffect } from 'react';

const SETTINGS_KEY = 'homepage_settings_v1';

export type HomepageSection = 'continueReading' | 'ayah' | 'hadith' | 'dua' | 'asmaulhusna' | 'shortcuts' | 'dailyQuestion' | 'khatma' | 'habitTracker';

type HomepageSettings = Record<HomepageSection, boolean>;

const defaultSettings: HomepageSettings = {
    continueReading: true,
    khatma: true,
    habitTracker: true,
    ayah: true,
    hadith: true,
    dua: true,
    asmaulhusna: false,
    shortcuts: true,
    dailyQuestion: false,
};

export const useHomepageSettings = () => {
    const [settings, setSettings] = useState<HomepageSettings>(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to handle new sections being added later
                return { ...defaultSettings, ...parsed };
            }
            return defaultSettings;
        } catch (error) {
            console.error("Failed to load homepage settings from localStorage", error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save homepage settings to localStorage", error);
        }
    }, [settings]);

    const toggleSetting = useCallback((key: HomepageSection) => {
        setSettings(s => ({ ...s, [key]: !s[key] }));
    }, []);

    const isVisible = useCallback((key: HomepageSection) => {
        return settings[key];
    }, [settings]);

    return { settings, toggleSetting, isVisible };
};