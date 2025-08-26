import { useState, useCallback, useEffect } from 'react';
import type { KhatmaPlan } from '../types';
import { generateKhatmaPlan } from '../services/khatmaPlanner';

const KHATMA_KEY = 'khatma_plan_v1';

export const useKhatma = () => {
    const [plan, setPlan] = useState<KhatmaPlan | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(KHATMA_KEY);
            if (stored) {
                setPlan(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load Khatma plan from localStorage", error);
        }
    }, []);

    const savePlan = useCallback((newPlan: KhatmaPlan | null) => {
        try {
            if (newPlan) {
                localStorage.setItem(KHATMA_KEY, JSON.stringify(newPlan));
            } else {
                localStorage.removeItem(KHATMA_KEY);
            }
            setPlan(newPlan);
        } catch (error) {
            console.error("Failed to save Khatma plan to localStorage", error);
        }
    }, []);

    const startKhatma = useCallback((goalId: string) => {
        const sections = generateKhatmaPlan(goalId);
        if (sections.length > 0) {
            const newPlan: KhatmaPlan = {
                goalId,
                sections,
                completedSections: 0,
                startDate: new Date().toISOString(),
            };
            savePlan(newPlan);
        }
    }, [savePlan]);

    const completeSection = useCallback(() => {
        if (plan && plan.completedSections < plan.sections.length) {
            const newPlan = { ...plan, completedSections: plan.completedSections + 1 };
            savePlan(newPlan);
        }
    }, [plan, savePlan]);

    const resetKhatma = useCallback(() => {
        savePlan(null);
    }, [savePlan]);

    return { plan, startKhatma, completeSection, resetKhatma };
};
