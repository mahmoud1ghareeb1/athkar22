import { useState, useCallback, useEffect } from 'react';

const SETTINGS_KEY = 'athkar_settings_v2'; // version up

export type DisplayMode = 'vertical' | 'horizontal';

export interface AthkarSettings {
    vibrateOnZero: boolean;
    hideOnZero: boolean;
    countOnPress: boolean;
    confirmOnExit: boolean;
    displayMode: DisplayMode;
    fontSize: number;
}

const defaultSettings: AthkarSettings = {
    vibrateOnZero: true,
    hideOnZero: false,
    countOnPress: true,
    confirmOnExit: true,
    displayMode: 'vertical',
    fontSize: 22,
};

export const useAthkarSettings = () => {
    const [settings, setSettings] = useState<AthkarSettings>(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...defaultSettings, ...parsed };
            }
            return defaultSettings;
        } catch (error) {
            console.error("Failed to load Athkar settings from localStorage", error);
            return defaultSettings;
        }
    });

    const saveSettings = useCallback((newSettings: AthkarSettings) => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error)
        {
            console.error("Failed to save Athkar settings to localStorage", error);
        }
    }, []);

    const updateSetting = useCallback(<K extends keyof AthkarSettings>(key: K, value: AthkarSettings[K]) => {
        setSettings(s => {
            const newSettings = { ...s, [key]: value };
            saveSettings(newSettings);
            return newSettings;
        });
    }, [saveSettings]);

    return { settings, updateSetting };
};
