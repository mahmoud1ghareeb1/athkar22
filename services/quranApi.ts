import type { QuranPageData, Ayah, Surah, Tafsir } from '../types';
import { quranDataByPage } from '../data/quran-pages';
import { surahList, juzs } from '../constants';

// --- Pre-computation for faster lookups ---

const surahStartAyahMap = new Map<number, number>();
const surahDataMap = new Map<string, Surah>();
let cumulativeAyahs = 0;
for (const surah of surahList) {
    surahStartAyahMap.set(surah.number, cumulativeAyahs + 1);
    surahDataMap.set(surah.name, surah);
    cumulativeAyahs += surah.numberOfAyahs;
}

const getOverallAyahNumber = (surahNumber: number, numberInSurah: number): number => {
    return (surahStartAyahMap.get(surahNumber) ?? 0) + numberInSurah - 1;
};

const getJuzFromPage = (pageNumber: number): number => {
    for (let i = juzs.length - 1; i >= 0; i--) {
        if (pageNumber >= juzs[i].startingPage) {
            return juzs[i].id;
        }
    }
    return 1; // Default to Juz 1
};


// Rewritten getPage function to use local data
export const getPage = async (pageNumber: number): Promise<QuranPageData> => {
    return new Promise((resolve, reject) => {
        const pageData = quranDataByPage.find(p => p.page_index === pageNumber);

        if (!pageData) {
            // To allow the user to add more pages later without getting an error.
            // reject(new Error(`Page ${pageNumber} not found in local data.`));
            console.warn(`Page ${pageNumber} not found in local data. Displaying empty page.`);
            resolve({ pageNumber, ayahs: [] });
            return;
        }

        const ayahs: Ayah[] = [];
        const juz = getJuzFromPage(pageNumber);

        for (const surahName in pageData.verses_by_sura) {
            const surahMeta = surahDataMap.get(surahName);
            if (!surahMeta) continue;

            const verses = pageData.verses_by_sura[surahName];
            for (const verse of verses) {
                // Skip Bismillah verses (index 0), as they are handled by SurahHeader component
                // Except for Al-Fatiha where it is the first verse (index 1)
                if (verse.index === 0) {
                    continue;
                }
                
                const numberInSurah = verse.index;
                const overallNumber = getOverallAyahNumber(surahMeta.number, numberInSurah);
                
                ayahs.push({
                    number: overallNumber,
                    numberInSurah: numberInSurah,
                    text: verse.text,
                    juz: juz,
                    page: pageNumber,
                    surah: {
                        number: surahMeta.number,
                        name: surahMeta.name,
                        englishName: surahMeta.englishName,
                    },
                });
            }
        }
        
        ayahs.sort((a, b) => a.number - b.number);

        resolve({
            pageNumber: pageNumber,
            ayahs,
        });
    });
};

// Rewritten searchQuran function to use local data
export const searchQuran = async (term: string): Promise<Ayah[]> => {
    return new Promise((resolve) => {
        if (!term) {
            resolve([]);
            return;
        }
        
        const results: Ayah[] = [];
        const normalizedTerm = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[\u0622\u0623\u0625]/g, "ا").replace(/ة/g, "ه");
        const regex = new RegExp(normalizedTerm, "i");

        quranDataByPage.forEach(pageData => {
            const juz = getJuzFromPage(pageData.page_index);
            for (const surahName in pageData.verses_by_sura) {
                const surahMeta = surahDataMap.get(surahName);
                if (!surahMeta) continue;

                const verses = pageData.verses_by_sura[surahName];
                for (const verse of verses) {
                    const normalizedText = verse.text.toLowerCase().replace(/[\u0622\u0623\u0625]/g, "ا").replace(/ة/g, "ه");

                    if (regex.test(normalizedText)) {
                        const numberInSurah = verse.index;
                        const overallNumber = getOverallAyahNumber(surahMeta.number, numberInSurah);
                        results.push({
                            number: overallNumber,
                            numberInSurah: numberInSurah,
                            text: verse.text,
                            juz: juz,
                            page: pageData.page_index,
                            surah: {
                                number: surahMeta.number,
                                name: surahMeta.name,
                                englishName: surahMeta.englishName,
                            },
                        });
                    }
                }
            }
        });
        
        resolve(results);
    });
};


// Rewritten getAyah function to use local data
export const getAyah = async (ayahNumber: number): Promise<Ayah> => {
     return new Promise((resolve, reject) => {
        for (const pageData of quranDataByPage) {
            const juz = getJuzFromPage(pageData.page_index);
            for (const surahName in pageData.verses_by_sura) {
                const surahMeta = surahDataMap.get(surahName);
                if (!surahMeta) continue;

                for (const verse of pageData.verses_by_sura[surahName]) {
                    const numberInSurah = verse.index;
                    const overallNumber = getOverallAyahNumber(surahMeta.number, numberInSurah);
                    if (overallNumber === ayahNumber) {
                        resolve({
                            number: overallNumber,
                            numberInSurah: numberInSurah,
                            text: verse.text,
                            juz: juz,
                            page: pageData.page_index,
                            surah: {
                                number: surahMeta.number,
                                name: surahMeta.name,
                                englishName: surahMeta.englishName,
                            },
                        });
                        return;
                    }
                }
            }
        }
        reject(new Error(`Ayah ${ayahNumber} not found in local data.`));
    });
}

// New helper function to find the page for a given Surah and Ayah number
export const findPageForSurahAyah = (surahNumber: number, ayahInSurah: number): { page: number; ayahNumberOverall: number } | null => {
    const surahInfo = surahList.find(s => s.number === surahNumber);
    if (!surahInfo || ayahInSurah > surahInfo.numberOfAyahs || ayahInSurah < 1) {
        return null; // Invalid input
    }
    
    const ayahNumberOverall = getOverallAyahNumber(surahNumber, ayahInSurah);

    for (const page of quranDataByPage) {
        const versesForSurah = page.verses_by_sura[surahInfo.name];
        if (versesForSurah) {
            for (const verse of versesForSurah) {
                if (verse.index === ayahInSurah) {
                    return { page: page.page_index, ayahNumberOverall };
                }
            }
        }
    }
    
    // Fallback if not found in the initial pages (should be rare)
    // We can estimate based on starting page, but let's stick to exact search for now.
    return null;
};

export const getTafsir = async (surahNumber: number, ayahNumberInSurah: number): Promise<Tafsir | null> => {
    try {
        // Fetch Tafsir Al-Sa'di from local data files
        const response = await fetch(`./data/ar-tafseer-al-saddi/${surahNumber}/${ayahNumberInSurah}.json`);
        if (!response.ok) {
            throw new Error(`Tafsir file not found for ${surahNumber}:${ayahNumberInSurah}`);
        }
        const data = await response.json();
        if (data && typeof data.text === 'string') {
            return { text: data.text };
        }
        return null;
    } catch (error) {
        console.error(`Failed to load Tafsir for ${surahNumber}:${ayahNumberInSurah}`, error);
        return null;
    }
};
