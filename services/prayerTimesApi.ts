import type { PrayerTimes } from '../types';

const API_BASE_URL = 'https://api.aladhan.com/v1/timings';

const PRAYER_TIMES_KEY = 'prayer_times_cache';
const LOCATION_KEY = 'user_location_cache';

interface Coords {
    latitude: number;
    longitude: number;
}

export const saveLocation = (coords: Coords) => {
    try {
        localStorage.setItem(LOCATION_KEY, JSON.stringify(coords));
    } catch (error) {
        console.error('Failed to save location to localStorage', error);
    }
};

export const getSavedLocation = (): Coords | null => {
    try {
        const stored = localStorage.getItem(LOCATION_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Failed to get location from localStorage', error);
        return null;
    }
};


export const fetchPrayerTimes = async (latitude: number, longitude: number): Promise<{ times: PrayerTimes, date: string }> => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const cachedData = getCachedPrayerTimes();

    if (cachedData && cachedData.date === today) {
        // Use cached data if it's for today
        return cachedData;
    }
    
    // Fetch new data
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    // Using method 2 (ISNA) as a common default.
    const response = await fetch(`${API_BASE_URL}/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=2`);

    if (!response.ok) {
        throw new Error('Failed to fetch prayer times.');
    }

    const data = await response.json();

    if (data.code !== 200) {
        throw new Error(data.status || 'An error occurred while fetching prayer times.');
    }

    const timings = data.data.timings;
    const transformedTimings: PrayerTimes = {
        Fajr: timings.Fajr,
        Sunrise: timings.Sunrise,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
    };
    
    const result = { times: transformedTimings, date: today };
    cachePrayerTimes(result); // Cache the new data
    return result;
};


const getCachedPrayerTimes = (): { times: PrayerTimes, date: string } | null => {
    try {
        const stored = localStorage.getItem(PRAYER_TIMES_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Basic validation
            if (parsed && parsed.date && parsed.times) {
                return parsed;
            }
        }
        return null;
    } catch (error) {
        console.error('Failed to retrieve cached prayer times', error);
        return null;
    }
};

const cachePrayerTimes = (data: { times: PrayerTimes, date: string }) => {
    try {
        localStorage.setItem(PRAYER_TIMES_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to cache prayer times', error);
    }
};
