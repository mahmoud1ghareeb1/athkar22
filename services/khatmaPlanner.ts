import { khatmaGoals } from '../constants';
import type { KhatmaSection } from '../types';

const TOTAL_QURAN_PAGES = 604;
const AYAH_PER_PAGE_APPROX = 10.3; // Very rough average

export const generateKhatmaPlan = (goalId: string): KhatmaSection[] => {
    const goal = khatmaGoals.find(g => g.id === goalId);
    if (!goal) return [];

    const sections: KhatmaSection[] = [];
    let currentPage = 1;
    let sectionNumber = 1;

    while (currentPage <= TOTAL_QURAN_PAGES) {
        const startPage = currentPage;
        const pageCount = Math.round(goal.pagesPerDay);
        let endPage = Math.min(startPage + pageCount - 1, TOTAL_QURAN_PAGES);
        
        sections.push({
            sectionNumber: sectionNumber,
            startPage: startPage,
            endPage: endPage,
            pageCount: (endPage - startPage + 1),
            ayahCount: Math.round((endPage - startPage + 1) * AYAH_PER_PAGE_APPROX),
        });

        currentPage = endPage + 1;
        sectionNumber++;
    }

    return sections;
};
