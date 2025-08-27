

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { surahList, juzs, khatmaGoals } from '../constants';
import { getPage as fetchPageAPI, searchQuran as searchQuranAPI, findPageForSurahAyah } from '../services/quranApi';
import type { Surah, Ayah, QuranPageData, Reciter, KhatmaGoal } from '../types';
import { SearchIcon, PlayIcon, PauseIcon, ChevronRightIcon, ArrowLeftIcon as ArrowBackIcon, CheckIcon, MapPinIcon } from '../components/Icons';
import Header from '../components/Header';
import { useBookmarks } from '../hooks/useBookmarks';
import AyahActionMenu from '../components/AyahActionMenu';
import SurahHeader from '../components/SurahHeader';
import QuranSettingsModal from '../components/QuranSettingsModal';
import { useQuranSettings } from '../hooks/useQuranSettings';
import { useLastReadPosition } from '../hooks/useLastReadPosition';
import { useShare } from '../hooks/useShare';
import { useKhatma } from '../hooks/useKhatma';
import CompletionModal from '../components/CompletionModal';
import AudioPlayer from '../components/AudioPlayer';
import GoToModal from '../components/GoToModal';
import TafsirModal from '../components/TafsirModal';

// --- Quran Reader Page Component ---
interface QuranReaderPageProps {
    initialPage: number;
    highlightAyahNum?: number;
    khatmaSectionNumber?: number;
    onBack: () => void;
    onKhatmaSectionComplete?: (sectionNumber: number) => void;
}

const QuranReaderPage: React.FC<QuranReaderPageProps> = ({ initialPage, highlightAyahNum, khatmaSectionNumber, onBack, onKhatmaSectionComplete }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageData, setPageData] = useState<QuranPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
    const { saveLastReadPosition } = useLastReadPosition();
    const { handleShare } = useShare();
    
    const [uiVisible, setUiVisible] = useState(true);
    const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
    const [actionMenuAyah, setActionMenuAyah] = useState<Ayah | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tafsirAyah, setTafsirAyah] = useState<Ayah | null>(null);
    
    const [audioPlayerConfig, setAudioPlayerConfig] = useState<{ playlist: Ayah[]; startAyah: Ayah } | null>(null);
    const [isContinuousPlayActive, setIsContinuousPlayActive] = useState(false);
    const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
    
    const { settings, setReciter, setFontSize } = useQuranSettings();
    const { reciter, fontSize } = settings;

    const pageCache = useRef(new Map<number, QuranPageData>());
    const touchStartX = useRef(0);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const ayahRefs = useRef<Map<number, HTMLSpanElement>>(new Map());

    useEffect(() => {
        if (khatmaSectionNumber) return;

        return () => {
            if (pageData && pageData.ayahs.length > 0) {
                const firstAyahOnPage = pageData.ayahs[0];
                saveLastReadPosition({
                    page: pageData.pageNumber,
                    surahName: firstAyahOnPage.surah.name,
                    ayahInSurah: firstAyahOnPage.numberInSurah,
                    ayahNumber: firstAyahOnPage.number,
                });
            }
        };
    }, [pageData, saveLastReadPosition, khatmaSectionNumber]);

    useEffect(() => {
        const fetchPage = async () => {
            if (pageCache.current.has(currentPage)) {
                setPageData(pageCache.current.get(currentPage)!);
                setLoading(false);
                setError(null); return;
            }
            setLoading(true); setError(null);
            try {
                const data = await fetchPageAPI(currentPage);
                pageCache.current.set(currentPage, data);
                setPageData(data);
            } catch (err) {
                setError('فشل في تحميل الصفحة. يرجى التحقق من اتصالك بالإنترنت.');
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [currentPage]);
    
    useEffect(() => {
        if (highlightAyahNum && pageData) {
            const element = ayahRefs.current.get(highlightAyahNum);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setSelectedAyah(pageData.ayahs.find(a => a.number === highlightAyahNum) || null);
                    setTimeout(() => setSelectedAyah(null), 3000);
                }, 200);
            }
        }
    }, [pageData, highlightAyahNum]);

    // Effect for continuous playback on page change
    useEffect(() => {
        if (isContinuousPlayActive && pageData && pageData.ayahs.length > 0) {
            setAudioPlayerConfig({ playlist: pageData.ayahs, startAyah: pageData.ayahs[0] });
        }
    }, [pageData, isContinuousPlayActive]);


    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (actionMenuAyah || audioPlayerConfig || isSettingsOpen) return;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX.current;
        if (Math.abs(deltaX) > 50) {
            // User requested to reverse swipe direction
            // Swipe right (positive deltaX) -> Next Page
            if (deltaX > 0 && currentPage < 604) setCurrentPage(p => p + 1);
            // Swipe left (negative deltaX) -> Previous Page
            else if (deltaX < 0 && currentPage > 1) setCurrentPage(p => p - 1);
        } else {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-ayah-number]')) {
                setUiVisible(v => !v);
            }
        }
    };
    
    const handleAyahPointerDown = (ayah: Ayah) => {
        longPressTimer.current = setTimeout(() => {
            setActionMenuAyah(ayah);
        }, 500);
    };

    const handleAyahPointerUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };
    
    const handleBookmark = (ayah: Ayah) => {
        isBookmarked(ayah.surah.number, ayah.numberInSurah)
            ? removeBookmark(ayah.surah.number, ayah.numberInSurah)
            : addBookmark(ayah);
    };

    const handleCompleteReading = () => {
        if (onKhatmaSectionComplete && khatmaSectionNumber) {
            onKhatmaSectionComplete(khatmaSectionNumber);
        }
    }

    const renderContent = () => {
        if (loading) return <div className="flex justify-center items-center h-full"><p>جاري تحميل الصفحة...</p></div>;
        if (error) return <div className="flex justify-center items-center h-full"><p className="text-red-500">{error}</p></div>;
        if (!pageData) return <div className="flex justify-center items-center h-full"><p>لا توجد بيانات.</p></div>;
        
        return (
            <div className="flex-grow px-4 pb-4 bg-gray-900 overflow-y-auto" dir="rtl">
                <div style={{ fontSize: `${fontSize}px`, lineHeight: 2.5, textAlignLast: 'center' }} className="font-amiri-quran text-gray-100 text-justify">
                    {pageData.ayahs.map((ayah) => {
                        const isSelected = selectedAyah?.number === ayah.number;
                        const isPlaying = playingAyahNumber === ayah.number;
                        const isLongPressed = actionMenuAyah?.number === ayah.number;

                        let ayahText = ayah.text;
                        if (ayah.numberInSurah === 1 && ayah.surah.number !== 1 && ayah.surah.number !== 9) {
                            // The basmalah is displayed in the SurahHeader, so we remove it from the first ayah's text if the API includes it.
                            ayahText = ayahText.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", '').trim();
                        }

                        return (
                           <React.Fragment key={ayah.number}>
                                {ayah.numberInSurah === 1 && <SurahHeader surahName={ayah.surah.name} surahNumber={ayah.surah.number} />}
                                <span 
                                    ref={el => { if (el) ayahRefs.current.set(ayah.number, el); }}
                                    data-ayah-number={ayah.number}
                                    onMouseDown={() => handleAyahPointerDown(ayah)}
                                    onMouseUp={handleAyahPointerUp}
                                    onTouchStart={() => handleAyahPointerDown(ayah)}
                                    onTouchEnd={handleAyahPointerUp}
                                    onTouchCancel={handleAyahPointerUp}
                                    className={`inline transition-all duration-300 p-1 rounded-md cursor-pointer
                                        ${isPlaying ? 'bg-green-500/40 text-green-100' : ''}
                                        ${isSelected ? 'bg-yellow-500/40' : ''}
                                        ${isLongPressed ? 'bg-blue-500/30 ring-2 ring-blue-400' : ''}
                                    `}
                                >
                                    {ayahText}
                                    <span className="text-green-400 text-lg mx-1 font-sans">({ayah.numberInSurah})</span>
                                </span>
                           </React.Fragment>
                        );
                    })}
                </div>
            </div>
        )
    }
    
    const topBarInfo = useMemo(() => {
        if (!pageData || !pageData.ayahs.length) return { surah: 'القرآن الكريم', juz: '' };
        const firstAyah = pageData.ayahs[0];
        const uniqueSurahNames = [...new Set(pageData.ayahs.map(a => a.surah.name))];
        return { surah: uniqueSurahNames.join(' - '), juz: `الجزء ${firstAyah.juz}` };
    }, [pageData]);

    return (
        <div className="fixed inset-0 bg-gray-900 z-20 flex flex-col animate-fade-in" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className={`transition-transform duration-300 ${!uiVisible ? '-translate-y-full' : ''}`}>
                <Header title={topBarInfo.surah} onBack={onBack} onSettingsClick={() => setIsSettingsOpen(true)}
                    actions={
                        <button onClick={() => {
                            if (pageData?.ayahs.length) {
                                setAudioPlayerConfig({ playlist: pageData.ayahs, startAyah: pageData.ayahs[0] });
                                setIsContinuousPlayActive(true);
                            }
                        }} className="p-2 text-gray-300">
                            <PlayIcon className="w-7 h-7" />
                        </button>
                    }>
                     <div className="text-center">
                        <h1 className="text-xl font-bold text-green-400">{topBarInfo.surah}</h1>
                        <p className="text-sm text-gray-400">{topBarInfo.juz}</p>
                    </div>
                </Header>
            </div>
            
            <main className="flex-grow flex flex-col overflow-hidden pb-16">{renderContent()}</main>

            <div className={`fixed bottom-0 left-0 right-0 bg-gray-800 p-2 text-center font-semibold text-gray-300 border-t border-gray-700 transition-transform duration-300 ${!uiVisible ? 'translate-y-full' : ''} ${khatmaSectionNumber ? 'pb-16' : ''}`}>
                صفحة {currentPage}
            </div>

            {khatmaSectionNumber && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800/80 backdrop-blur-sm transition-transform duration-300">
                     <button onClick={handleCompleteReading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                        اتممت القراءة
                    </button>
                </div>
            )}

            {isSettingsOpen && <QuranSettingsModal settings={settings} onClose={() => setIsSettingsOpen(false)} onReciterChange={setReciter} onFontSizeChange={setFontSize} />}
            
            <AyahActionMenu
                ayah={actionMenuAyah}
                onClose={() => setActionMenuAyah(null)}
                isBookmarked={actionMenuAyah ? isBookmarked(actionMenuAyah.surah.number, actionMenuAyah.numberInSurah) : false}
                onListen={(ayah) => {
                    setAudioPlayerConfig({ playlist: [ayah], startAyah: ayah });
                    setIsContinuousPlayActive(false);
                }}
                onBookmark={handleBookmark}
                onTafsir={(ayah) => setTafsirAyah(ayah)}
                onShare={(ayah) => handleShare(`${ayah.text} (سورة ${ayah.surah.name}:${ayah.numberInSurah})`, 'آية من القرآن الكريم')}
            />

            {audioPlayerConfig && (
                <AudioPlayer
                    playlist={audioPlayerConfig.playlist}
                    startAyah={audioPlayerConfig.startAyah}
                    reciter={reciter}
                    setReciter={setReciter}
                    onAyahChange={setPlayingAyahNumber}
                    onClose={() => {
                        setAudioPlayerConfig(null);
                        setIsContinuousPlayActive(false);
                        setPlayingAyahNumber(null);
                    }}
                />
            )}
            
            {tafsirAyah && <TafsirModal ayah={tafsirAyah} onClose={() => setTafsirAyah(null)} />}
        </div>
    );
};

// --- Khatma Components ---
const KhatmaGoalModal: React.FC<{onClose: () => void; onSelectGoal: (goalId: string) => void;}> = ({ onClose, onSelectGoal }) => {
    const [selectedGoalId, setSelectedGoalId] = useState<string>(khatmaGoals[0].id);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl flex flex-col animate-fade-in-up border border-gray-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center text-green-400 p-4 border-b border-gray-700">الهدف</h2>
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                    <p className="text-center text-gray-400 mb-2">يرجى اختيار هدف الختمة الذي يناسبك من القائمة التالية:</p>
                    {khatmaGoals.map(goal => (
                        <label key={goal.id} htmlFor={goal.id} className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer">
                            <input type="radio" id={goal.id} name="khatma-goal" value={goal.id} checked={selectedGoalId === goal.id} onChange={(e) => setSelectedGoalId(e.target.value)} className="form-radio text-green-500 bg-gray-800 border-gray-600 focus:ring-green-500"/>
                            <div className="mr-4">
                                <p className="font-semibold text-gray-200">{goal.title}</p>
                                <p className="text-sm text-gray-400">{goal.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="flex justify-between p-4 border-t border-gray-700">
                    <button onClick={onClose} className="px-6 py-2 text-gray-300 hover:text-white">إلغاء</button>
                    <button onClick={() => onSelectGoal(selectedGoalId)} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">بدء الختمة</button>
                </div>
            </div>
        </div>
    )
}

const KhatmaPage: React.FC<{ openReader: (page: number, sectionNumber: number) => void }> = ({ openReader }) => {
    const { plan, startKhatma, resetKhatma } = useKhatma();
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <h2 className="text-2xl font-bold text-green-400 mb-2">لم تبدأ أي ختمة بعد</h2>
                <p className="text-gray-400 mb-6">ابدأ ختمة جديدة وتتبع تقدمك في قراءة القرآن الكريم.</p>
                <button onClick={() => setIsGoalModalOpen(true)} className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">بدء الختمة</button>
                {isGoalModalOpen && <KhatmaGoalModal onClose={() => setIsGoalModalOpen(false)} onSelectGoal={(goalId) => { startKhatma(goalId); setIsGoalModalOpen(false); }} />}
            </div>
        );
    }
    
    return (
        <div className="p-4 space-y-3">
            <h2 className="text-xl font-bold text-green-400 mb-4">خطة الختمة</h2>
            {plan.sections.map((section, index) => {
                const isCompleted = index < plan.completedSections;
                const isCurrent = index === plan.completedSections;
                const isLocked = index > plan.completedSections;
                return (
                    <button key={section.sectionNumber} onClick={() => !isLocked && openReader(section.startPage, section.sectionNumber)} disabled={isLocked}
                        className={`w-full bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between transition ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-900/50 cursor-pointer'} ${isCurrent ? 'border-2 border-green-500' : ''}`}
                    >
                        <div className="flex items-center space-x-4 space-x-reverse">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                {isCompleted ? <CheckIcon className="w-6 h-6"/> : section.sectionNumber}
                            </div>
                            <div>
                                <p className="font-bold text-lg text-right text-gray-100">القسم {section.sectionNumber}</p>
                                <p className="text-sm text-right text-gray-400">{`الصفحات: ${section.startPage} - ${section.endPage}`}</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-sm text-gray-400">عدد الصفحات</p>
                            <p className="font-semibold text-gray-200">{section.pageCount}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};


// --- Main Quran Page Component ---
type Tab = 'surah' | 'juz' | 'search' | 'bookmark' | 'khatma';
type View = { mode: 'tabs' } | { mode: 'reader', page: number, highlightAyahNum?: number, khatmaSectionNumber?: number };

const QuranPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('surah');
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<View>({ mode: 'tabs' });
    const { getBookmarks } = useBookmarks();
    const { lastRead } = useLastReadPosition();
    const { completeSection } = useKhatma();
    
    const [searchResults, setSearchResults] = useState<Ayah[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const debounceTimeout = useRef<number | null>(null);

    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [isGoToModalOpen, setIsGoToModalOpen] = useState(false);
    
    const bookmarks = getBookmarks();
    
    useEffect(() => {
        const initialView = localStorage.getItem('quran_initial_view');
        if (initialView === 'khatma') {
            setActiveTab('khatma');
            localStorage.removeItem('quran_initial_view');
        }

        const shouldStartAtLastRead = localStorage.getItem('start_quran_at_last_read');
        if (shouldStartAtLastRead === 'true') {
            localStorage.removeItem('start_quran_at_last_read');
            if (lastRead) {
                openReaderAtPage(lastRead.page, lastRead.ayahNumber);
            }
        }
    }, [lastRead]);

    const openReaderAtPage = (pageNumber: number, ayahToHighlight?: number, khatmaSection?: number) => {
        setView({ mode: 'reader', page: pageNumber, highlightAyahNum: ayahToHighlight, khatmaSectionNumber: khatmaSection });
    };

    const handleOpenKhatmaReader = (pageNumber: number, sectionNumber: number) => {
        openReaderAtPage(pageNumber, undefined, sectionNumber);
    };
    
    const handleKhatmaSectionComplete = (sectionNumber: number) => {
        completeSection();
        setShowCompletionModal(true);
        setView({ mode: 'tabs' }); // Go back to the plan view
    }

    const filteredSurahs = useMemo(() =>
        surahList.filter(surah =>
            surah.name.includes(searchTerm) ||
            surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            surah.number.toString().includes(searchTerm)
        ), [searchTerm]);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) setActiveTab('search');
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        if (!term) { setSearchResults([]); setSearchError(null); return; }

        debounceTimeout.current = window.setTimeout(async () => {
            setIsSearching(true); setSearchError(null);
            try {
                const results = await searchQuranAPI(term);
                setSearchResults(results);
            } catch (error) {
                setSearchError("فشل البحث. يرجى التحقق من اتصالك بالإنترنت.");
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const handleNavigate = (page: number, ayahNumberOverall?: number) => {
        openReaderAtPage(page, ayahNumberOverall);
    };

    const TabButton = ({ id, label }: { id: Tab; label: string }) => (
        <button onClick={() => setActiveTab(id)} className={`py-3 px-4 font-semibold w-full transition-colors text-sm ${activeTab === id ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}>
            {label}
        </button>
    );
    
    if (view.mode === 'reader') {
        return <QuranReaderPage 
            initialPage={view.page} 
            highlightAyahNum={view.highlightAyahNum} 
            khatmaSectionNumber={view.khatmaSectionNumber}
            onBack={() => setView({ mode: 'tabs' })} 
            onKhatmaSectionComplete={handleKhatmaSectionComplete}
        />;
    }

    return (
        <div>
            {showCompletionModal && (
                <CompletionModal
                    title="تهانينا!"
                    message="لقد أتممت هذا القسم بنجاح. استمر في تقدمك!"
                    onClose={() => setShowCompletionModal(false)}
                />
            )}
            {isGoToModalOpen && (
                <GoToModal 
                    onClose={() => setIsGoToModalOpen(false)}
                    onNavigate={handleNavigate}
                    findPageForSurahAyah={findPageForSurahAyah}
                />
            )}
            <header className="bg-gray-800/90 backdrop-blur-sm sticky top-0 z-10 p-4 pb-0">
                <div className="relative mb-4">
                    <input type="text" placeholder="ابحث في السور أو في آيات القرآن..." className="w-full bg-gray-700 text-gray-200 rounded-full py-2.5 px-4 pr-16 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600 placeholder-gray-400" value={searchTerm} onChange={handleSearchChange} />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center space-x-2">
                         <button onClick={() => setIsGoToModalOpen(true)} className="p-1 text-gray-300 hover:text-green-400" aria-label="Go to Ayah or Page">
                            <MapPinIcon className="w-5 h-5" />
                        </button>
                        <SearchIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex justify-around items-center border-b border-gray-700">
                    <TabButton id="bookmark" label="المحفوظات" />
                    <TabButton id="khatma" label="الختمة" />
                    <TabButton id="juz" label="جزء" />
                    <TabButton id="surah" label="سورة" />
                </div>
            </header>

            <div className={activeTab === 'surah' ? "p-4 grid grid-cols-2 gap-4" : "p-4 space-y-3"}>
                {activeTab === 'surah' && filteredSurahs.map((surah) => (
                    <div key={surah.number} onClick={() => openReaderAtPage(surah.startingPage)} className="bg-gray-800 p-3 rounded-lg shadow-md flex flex-col items-center justify-center text-center transition hover:bg-green-900/50 cursor-pointer aspect-square">
                         <p className="font-amiri-quran text-2xl text-green-300">{surah.name}</p>
                        <p className="text-sm text-gray-400 mt-1">{surah.revelationType === 'Medinan' ? 'مدنية' : 'مكية'} - {surah.numberOfAyahs} آيات</p>
                    </div>
                ))}
                
                {activeTab === 'juz' && juzs.map((juz) => (
                    <div key={juz.id} onClick={() => openReaderAtPage(juz.startingPage)} className="bg-gray-800 p-4 rounded-lg shadow-md text-center font-semibold text-lg hover:bg-green-900/50 transition cursor-pointer text-gray-200">
                        {juz.name}
                    </div>
                ))}
                
                 {activeTab === 'khatma' && <KhatmaPage openReader={handleOpenKhatmaReader} />}
                
                {activeTab === 'search' && (
                    <>
                        {isSearching && <p className="text-center text-gray-400 mt-8">جاري البحث...</p>}
                        {searchError && <p className="text-center text-red-500 mt-8 font-semibold">{searchError}</p>}
                        {!isSearching && !searchError && (
                            <>
                                {searchTerm && <p className="text-center text-gray-400 mb-4">{`تم العثور على ${searchResults.length} نتيجة`}</p>}
                                {searchResults.map(ayah => (
                                    <div key={ayah.number} onClick={() => openReaderAtPage(ayah.page, ayah.number)} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-green-900/50 transition cursor-pointer">
                                        <p className="text-lg mb-2 text-gray-200" dangerouslySetInnerHTML={{ __html: ayah.text.replace(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[\u0622\u0623\u0625]/g, "ا").replace(/ة/g, "ه"), "gi"), (match) => `<mark class="bg-green-400 text-black rounded px-1">${match}</mark>`) }} />
                                        <p className="text-sm text-green-400 font-semibold">{`سورة ${ayah.surah.name}, الآية ${ayah.numberInSurah}`}</p>
                                    </div>
                                ))}
                                {searchTerm && searchResults.length === 0 && <p className="text-center text-gray-400 mt-8">لم يتم العثور على نتائج.</p>}
                                {!searchTerm && <p className="text-center text-gray-400 mt-8">ادخل كلمة للبحث في آيات القرآن الكريم</p>}
                            </>
                        )}
                    </>
                )}
                
                {activeTab === 'bookmark' && (
                    <>
                        {bookmarks.length > 0 ? bookmarks.map(bookmark => (
                             <div key={`${bookmark.surahNumber}:${bookmark.ayahNumberInSurah}`} onClick={() => openReaderAtPage(bookmark.page, bookmark.ayahNumberOverall)} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-green-900/50 transition cursor-pointer">
                                <p className="text-lg mb-2 text-gray-200">{bookmark.text}</p>
                                <p className="text-sm text-green-400 font-semibold">{`سورة ${bookmark.surahName}, الآية ${bookmark.ayahNumberInSurah}`}</p>
                            </div>
                        )) : <p className="text-center text-gray-400 mt-8">لم تقم بحفظ أي آيات بعد.</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuranPage;