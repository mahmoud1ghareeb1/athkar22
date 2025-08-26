import { useState, useCallback, useEffect } from 'react';
import type { Statistics } from '../types';

const STATS_KEY = 'athkari_stats_v1';

const defaultStats: Statistics = {
    totalTasbeehCount: 0,
    athkarSessions: {},
};

export const useStatistics = () => {
    const [stats, setStats] = useState<Statistics>(defaultStats);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STATS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to ensure new stats are not missed
                setStats({ ...defaultStats, ...parsed });
            } else {
                setStats(defaultStats);
            }
        } catch (error) {
            console.error("Failed to load statistics from localStorage", error);
            setStats(defaultStats);
        }
    }, []);

    const saveStats = (newStats: Statistics) => {
        try {
            localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
            setStats(newStats);
        } catch (error) {
            console.error("Failed to save statistics to localStorage", error);
        }
    };

    const logTasbeeh = useCallback((countIncrement: number) => {
        setStats(currentStats => {
            const newStats = {
                ...currentStats,
                totalTasbeehCount: (currentStats.totalTasbeehCount || 0) + countIncrement,
            };
            saveStats(newStats);
            return newStats;
        });
    }, []);

    const logAthkarCategoryRead = useCallback((categoryId: string) => {
        setStats(currentStats => {
            const newStats = {
                ...currentStats,
                athkarSessions: {
                    ...currentStats.athkarSessions,
                    [categoryId]: (currentStats.athkarSessions[categoryId] || 0) + 1,
                },
            };
            saveStats(newStats);
            return newStats;
        });
    }, []);

    const getStats = useCallback(() => {
        return stats;
    }, [stats]);
    
    const resetStats = useCallback(() => {
        saveStats(defaultStats);
    }, []);

    return { getStats, logTasbeeh, logAthkarCategoryRead, resetStats };
};
