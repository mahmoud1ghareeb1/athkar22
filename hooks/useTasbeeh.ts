import { useState, useCallback, useEffect } from 'react';
import type { TasbeehItem } from '../types';

const TASBEEH_KEY = 'tasbeeh_items_v2';

const defaultTasbeehs: TasbeehItem[] = [
  { id: '1', text: 'سبحان الله و بحمده', benefit: 'عدد الحبات', targetCount: 33, totalCount: 0 },
  { id: '2', text: 'لا حول ولا قوة إلا بالله', benefit: 'عدد الحبات', targetCount: 33, totalCount: 0 },
  { id: '3', text: 'اللهم صل على سيدنا محمد وصحبه وسلم', benefit: 'عدد الحبات', targetCount: 100, totalCount: 0 },
  { id: '4', text: 'قراءة قل هو الله أحد', benefit: 'عدد الحبات', targetCount: 10, totalCount: 0 },
  { id: '5', text: 'أستغفر الله العظيم', benefit: 'عدد الحبات', targetCount: 33, totalCount: 0 },
];

export const useTasbeeh = () => {
    const [tasbeehList, setTasbeehList] = useState<TasbeehItem[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(TASBEEH_KEY);
            if (stored) {
                setTasbeehList(JSON.parse(stored));
            } else {
                setTasbeehList(defaultTasbeehs);
            }
        } catch (error) {
            console.error("Failed to load tasbeeh list from localStorage", error);
            setTasbeehList(defaultTasbeehs);
        }
    }, []);

    const saveList = (list: TasbeehItem[]) => {
        try {
            localStorage.setItem(TASBEEH_KEY, JSON.stringify(list));
            setTasbeehList(list);
        } catch (error) {
            console.error("Failed to save tasbeeh list to localStorage", error);
        }
    };

    const addTasbeeh = (item: Omit<TasbeehItem, 'id' | 'totalCount'>) => {
        const newItem: TasbeehItem = {
            ...item,
            id: new Date().toISOString(),
            totalCount: 0
        };
        const newList = [...tasbeehList, newItem];
        saveList(newList);
    };
    
    const updateTasbeehTotal = (id: string, newTotal: number) => {
        const newList = tasbeehList.map(item =>
            item.id === id ? { ...item, totalCount: newTotal } : item
        );
        saveList(newList);
    };

    const removeTasbeeh = (id: string) => {
        const newList = tasbeehList.filter(item => item.id !== id);
        saveList(newList);
    };

    return { tasbeehList, addTasbeeh, updateTasbeehTotal, removeTasbeeh };
};
