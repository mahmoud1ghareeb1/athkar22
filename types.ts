export type Page = 'home' | 'athkar' | 'quran' | 'messages' | 'more';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  startingPage: number;
}

export interface Ayah {
    number: number; // Overall number in Quran
    numberInSurah: number;
    text: string;
    surah: {
        number: number;
        name: string;
        englishName: string;
    };
    juz: number;
    page: number;
}

export interface QuranPageData {
    pageNumber: number;
    ayahs: Ayah[];
}

export interface Juz {
    id: number;
    name: string;
    startingPage: number;
}

export interface Bookmark {
    surahNumber: number;
    ayahNumberInSurah: number;
    ayahNumberOverall: number;
    text: string;
    surahName: string;
    page: number;
}

export interface LastReadPosition {
    page: number;
    surahName: string;
    ayahInSurah: number;
    ayahNumber: number; // Overall Ayah number
}


export interface Zikr {
  id: number | string;
  category: string;
  text: string;
  count: number;
  reference?: string;
  description?: string;
}

export interface AthkarCategory {
  id: string;
  title: string;
}

export interface Reciter {
    identifier: string;
    name: string;
    englishName: string;
}

export interface AsmaulHusna {
  name: string;
  transliteration: string;
  meaning: string;
  explanation: string;
}

export interface TasbeehItem {
  id: string; // uuid
  text: string;
  benefit: string;
  targetCount: number;
  totalCount: number;
}

export interface Feeling {
  id: string;
  name: string;
  emoji: string;
}

export interface Hadith {
  id: number;
  text: string;
  narrator: string;
}

export interface Dua {
  id: number;
  text: string;
}

export type PrayerTime = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type PrayerTimes = Record<PrayerTime, string>;

export interface Statistics {
    totalTasbeehCount: number;
    athkarSessions: Record<string, number>; // e.g. { sabah: 5, masaa: 3 }
}

export interface KhatmaGoal {
  id: string;
  title: string;
  description: string;
  days: number;
  pagesPerDay: number;
}

export interface KhatmaSection {
  sectionNumber: number;
  startPage: number;
  endPage: number;
  ayahCount: number; // approximate
  pageCount: number;
}

export interface KhatmaPlan {
  goalId: string;
  sections: KhatmaSection[];
  completedSections: number;
  startDate: string; // ISO string
}

export interface Habit {
  id: string;
  name: string;
  target: number;
  icon: string;
}

export interface HabitProgress {
  [habitId: string]: {
    [date: string]: number; // "YYYY-MM-DD": count
  };
}

export interface ProphetDuas {
  prophet: string;
  duas: Zikr[];
}

export interface Tafsir {
  text: string;
}

export type TafsirData = {
  [key: string]: Tafsir; // key is "surah:ayah"
}

export type Overlay = 
  | { name: 'asmaulhusna' }
  | { name: 'settings' }
  | { name: 'statistics' }
  | { name: 'feeling' }
  | { name: 'tasbeehList' }
  | { name: 'qibla' }
  | { name: 'prayerTimes' }
  | { name: 'addHabit' }
  | { name: 'prophetsDuas' }
  | { name: 'alhamd' }
  | { name: 'quranicDuas' }
  | { name: 'istighfar' }
  | { name: 'comingSoon'; props: { featureName: string } };