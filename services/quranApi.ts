import type { QuranPageData, Ayah } from '../types';
import { surahList } from '../constants';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

// Helper to find surah metadata locally
const getSurahMeta = (surahNumber: number) => {
    return surahList.find(s => s.number === surahNumber) || { name: 'Unknown', englishName: 'Unknown' };
}

// Transforms a single Ayah API response
const transformAyahData = (apiData: any): Ayah => {
    const ayah = apiData.data;
    const surahMeta = getSurahMeta(ayah.surah.number);
    return {
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        juz: ayah.juz,
        page: ayah.page,
        surah: {
            number: ayah.surah.number,
            name: surahMeta.name,
            englishName: surahMeta.englishName,
        },
    };
};

// Transforms API response for a page into our app's QuranPageData format
const transformPageData = (apiData: any): QuranPageData => {
    const ayahs = apiData.data.ayahs.map((ayah: any): Omit<Ayah, 'surah'> & { surah: { number: number }} => {
        return {
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text: ayah.text,
            juz: ayah.juz,
            page: ayah.page,
            surah: {
                number: ayah.surah.number,
            },
        };
    }).map((ayah: Omit<Ayah, 'surah'> & { surah: { number: number }}) => {
        const surahMeta = getSurahMeta(ayah.surah.number);
        return {
            ...ayah,
            surah: {
                ...ayah.surah,
                name: surahMeta.name,
                englishName: surahMeta.englishName,
            }
        }
    });
    
    // Sort ayahs by their overall number in the Quran to ensure correct order
    ayahs.sort((a: Ayah, b: Ayah) => a.number - b.number);

    return {
        pageNumber: apiData.data.number,
        ayahs,
    };
};

export const getPage = async (pageNumber: number): Promise<QuranPageData> => {
    const response = await fetch(`${API_BASE_URL}/page/${pageNumber}/quran-uthmani`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.code !== 200) {
        throw new Error(data.status);
    }
    return transformPageData(data);
};


export const getAyah = async (ayahNumber: number): Promise<Ayah> => {
    const response = await fetch(`${API_BASE_URL}/ayah/${ayahNumber}/quran-uthmani`);
     if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.code !== 200) {
        throw new Error(data.status);
    }
    return transformAyahData(data);
}


// Transforms search results into our app's Ayah array format
// Fetches the Uthmani text for each match to ensure correct display
const transformSearchData = async (apiData: any): Promise<Ayah[]> => {
    const matches = apiData.data.matches.slice(0, 100); // Limit to 100 results
    const ayahs: Ayah[] = [];

    for (const match of matches) {
        const surahMeta = getSurahMeta(match.surah.number);
        // The API gives us the simple text, but we want to display the Uthmani text.
        // We can fetch the correct text using the ayah number.
        // However, to avoid many API calls, we will use the text from the search result for display in the list,
        // and the full reader will show the proper Uthmani text.
        ayahs.push({
            number: match.number,
            numberInSurah: match.numberInSurah,
            text: match.text, // This is the simplified text from the search
            juz: match.juz,
            page: match.page,
            surah: {
                number: match.surah.number,
                name: surahMeta.name,
                englishName: surahMeta.englishName,
            },
        });
    }
    return ayahs;
};

export const searchQuran = async (term: string): Promise<Ayah[]> => {
    // We search using a "simple" edition which ignores most diacritics and uses standard characters
    // This makes matching much more reliable for user input.
    const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(term)}/all/quran-simple`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.code !== 200 || data.data.count === 0) {
        return [];
    }
    // Rely solely on the API's search capabilities with the 'quran-simple' edition.
    // The previous client-side filter was removed as it was likely causing data inconsistencies.
    return transformSearchData(data);
};