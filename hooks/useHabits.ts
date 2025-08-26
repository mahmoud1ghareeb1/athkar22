import { useState, useCallback, useEffect } from 'react';
import type { Habit, HabitProgress } from '../types';

const HABITS_KEY = 'athkari_habits_v1';
const HABITS_PROGRESS_KEY = 'athkari_habits_progress_v1';

const defaultHabits: Habit[] = [];

export const useHabits = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [todaysProgress, setTodaysProgress] = useState<HabitProgress>({});

    const loadData = useCallback(() => {
        try {
            const storedHabits = localStorage.getItem(HABITS_KEY);
            setHabits(storedHabits ? JSON.parse(storedHabits) : defaultHabits);

            const storedProgress = localStorage.getItem(HABITS_PROGRESS_KEY);
            setTodaysProgress(storedProgress ? JSON.parse(storedProgress) : {});
        } catch (error) {
            console.error("Failed to load habits data from localStorage", error);
            setHabits(defaultHabits);
            setTodaysProgress({});
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const saveHabits = (newHabits: Habit[]) => {
        try {
            localStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
            setHabits(newHabits);
        } catch (error) {
            console.error("Failed to save habits to localStorage", error);
        }
    };
    
    const saveProgress = (newProgress: HabitProgress) => {
        try {
            localStorage.setItem(HABITS_PROGRESS_KEY, JSON.stringify(newProgress));
            setTodaysProgress(newProgress);
        } catch (error) {
            console.error("Failed to save habits progress to localStorage", error);
        }
    };

    const addHabit = useCallback((newHabitData: Omit<Habit, 'id'>) => {
        const newHabit: Habit = {
            id: new Date().toISOString() + Math.random(),
            ...newHabitData,
        };
        saveHabits([...habits, newHabit]);
    }, [habits]);

    const incrementProgress = useCallback((habitId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const newProgress = { ...todaysProgress };
        if (!newProgress[habitId]) {
            newProgress[habitId] = {};
        }
        
        const currentCount = newProgress[habitId][today] || 0;

        if (currentCount < habit.target) {
            newProgress[habitId][today] = currentCount + 1;
        } else {
             // Reset if they click again after completion
            newProgress[habitId][today] = 0;
        }
        
        saveProgress(newProgress);
    }, [habits, todaysProgress]);

    return { habits, todaysProgress, addHabit, incrementProgress };
};