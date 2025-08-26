import { useState, useCallback, useEffect } from 'react';
import type { Bookmark, Ayah } from '../types';

const BOOKMARKS_KEY = 'quran_bookmarks_v3'; // Incremented version to add ayahNumber

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<Map<string, Bookmark>>(new Map());

    useEffect(() => {
        try {
            const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
            if (storedBookmarks) {
                const parsed = JSON.parse(storedBookmarks);
                setBookmarks(new Map(parsed));
            }
        } catch (error) {
            console.error("Failed to parse bookmarks from localStorage", error);
        }
    }, []);

    const saveBookmarks = (newBookmarks: Map<string, Bookmark>) => {
        try {
            const array = Array.from(newBookmarks.entries());
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(array));
            setBookmarks(newBookmarks);
        } catch (error) {
            console.error("Failed to save bookmarks to localStorage", error);
        }
    };

    const getKey = (surah: number, ayah: number) => `${surah}:${ayah}`;

    const addBookmark = useCallback((ayah: Ayah) => {
        const newBookmarks = new Map(bookmarks);
        const bookmark: Bookmark = {
            surahNumber: ayah.surah.number,
            ayahNumberInSurah: ayah.numberInSurah,
            ayahNumberOverall: ayah.number,
            text: ayah.text,
            surahName: ayah.surah.name,
            page: ayah.page,
        };
        newBookmarks.set(getKey(ayah.surah.number, ayah.numberInSurah), bookmark);
        saveBookmarks(newBookmarks);
    }, [bookmarks]);

    const removeBookmark = useCallback((surah: number, ayah: number) => {
        const newBookmarks = new Map(bookmarks);
        newBookmarks.delete(getKey(surah, ayah));
        saveBookmarks(newBookmarks);
    }, [bookmarks]);

    const isBookmarked = useCallback((surah: number, ayah: number) => {
        return bookmarks.has(getKey(surah, ayah));
    }, [bookmarks]);
    
    const getBookmarks = useCallback(() => {
        return Array.from(bookmarks.values()).sort((a, b) => a.page - b.page);
    }, [bookmarks]);


    return { bookmarks, addBookmark, removeBookmark, isBookmarked, getBookmarks };
};