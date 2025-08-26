import React, { useState } from 'react';
import type { Page, Overlay, Hadith, Dua, AsmaulHusna } from '../types';
import { ShareIcon, CheckIcon, PrayTogetherIcon, GroupIcon, TasbeehIcon, FeelingIcon, QiblaArrowIcon, PencilIcon } from '../components/Icons';
import { getDailyContent } from '../data/daily-content';
import { useShare } from '../hooks/useShare';
import EditHomepageModal from '../components/EditHomepageModal';
import { useHomepageSettings } from '../hooks/useHomepageSettings';
import { useLastReadPosition } from '../hooks/useLastReadPosition';
import { useKhatma } from '../hooks/useKhatma';
import { useHabits } from '../hooks/useHabits';

interface HomePageProps {
  setActivePage: (page: Page) => void;
  showOverlay: (overlay: Overlay) => void;
}

const HabitTracker: React.FC<{ showOverlay: (overlay: Overlay) => void; }> = ({ showOverlay }) => {
    const { habits, todaysProgress, incrementProgress } = useHabits();
    const today = new Date().toISOString().split('T')[0];

    if (habits.length === 0) {
        return (
            <div className="text-center">
                <p className="mb-3 text-gray-400">لا يوجد لديك عادات لليوم. يمكنك إضافة عادة جديدة.</p>
                <button onClick={() => showOverlay({ name: 'addHabit' })} className="bg-gray-700 hover:bg-gray-600 text-green-400 font-bold py-2 px-4 rounded-lg transition">
                    + إضافة عادة
                </button>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {habits.map(habit => {
                const progress = todaysProgress[habit.id]?.[today] || 0;
                const isCompleted = progress >= habit.target;
                const progressPercentage = (progress / habit.target) * 100;
                
                return (
                    <div key={habit.id} className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-3 space-x-reverse">
                            <span className="text-3xl">{habit.icon}</span>
                            <div>
                                <span className="font-semibold text-gray-200">{habit.name}</span>
                                {isCompleted && <p className="text-xs text-green-400 pt-1">تهانينا! لقد أكملت عادتك.</p>}
                            </div>
                        </div>
                        <button
                            onClick={() => incrementProgress(habit.id)}
                            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500`}
                            style={{
                                background: isCompleted 
                                    ? '#10B981' // Solid green-500
                                    : `conic-gradient(#10B981 ${progressPercentage}%, #4A5568 ${progressPercentage}%)` // green-500 to gray-600
                            }}
                            aria-label={`Increment habit ${habit.name}`}
                        >
                            <div className="absolute w-[calc(100%-12px)] h-[calc(100%-12px)] bg-gray-700 rounded-full"></div>
                            <div className="relative z-10 text-white font-bold text-lg">
                                {isCompleted ? (
                                    <CheckIcon className="w-8 h-8" />
                                ) : (
                                    <span>{progress}/{habit.target}</span>
                                )}
                            </div>
                        </button>
                    </div>
                );
            })}
             <div className="text-center pt-2">
                 <button onClick={() => showOverlay({ name: 'addHabit' })} className="text-sm text-green-400 font-semibold hover:underline">
                    + إضافة عادة جديدة
                </button>
             </div>
        </div>
    );
};


const HomePage: React.FC<HomePageProps> = ({ setActivePage, showOverlay }) => {
    const { handleShare } = useShare();
    const { settings, toggleSetting, isVisible } = useHomepageSettings();
    const { lastRead, clearLastReadPosition } = useLastReadPosition();
    const { plan: khatmaPlan } = useKhatma();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { ayah, hadith, dua, asmaulHusna } = getDailyContent();

    const shortcuts = [
        { name: "ادعو معي", icon: <PrayTogetherIcon className="w-8 h-8 text-green-300" />, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'ادعو معي' } }) },
        { name: "حلقات الذكر", icon: <GroupIcon className="w-8 h-8 text-green-300" />, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'حلقات الذكر' } }) },
        { name: "المسبحة", icon: <TasbeehIcon className="w-8 h-8 text-green-300" />, action: () => showOverlay({ name: 'tasbeehList' }) },
        { name: "بماذا تشعر؟", icon: <FeelingIcon className="w-8 h-8 text-green-300" />, action: () => showOverlay({ name: 'feeling' }) },
        { name: "القبلة", icon: <QiblaArrowIcon className="w-8 h-8 text-green-300" />, action: () => showOverlay({ name: 'qibla' }) },
    ];

    const handleContinueReading = () => {
        localStorage.setItem('start_quran_at_last_read', 'true');
        setActivePage('quran');
    };

    const goToKhatma = () => {
        localStorage.setItem('quran_initial_view', 'khatma');
        setActivePage('quran');
    }

    const DailyCard: React.FC<{ title: string; onShare?: () => void; children: React.ReactNode }> = ({ title, onShare, children }) => (
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-green-400">{title}</h3>
                {onShare && (
                  <button onClick={onShare} className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                  </button>
                )}
            </div>
            {children}
        </div>
    );

    return (
        <div dir="rtl">
            {isEditModalOpen && (
                <EditHomepageModal
                    settings={settings}
                    onToggle={toggleSetting}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
            <header className="p-4 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                 <h1 className="text-2xl font-bold text-green-400">الرئيسية</h1>
                 <button onClick={() => showOverlay({ name: 'settings' })} className="p-2 text-sm font-semibold text-gray-300 hover:text-green-400 transition-colors">
                    الإعدادات
                </button>
            </header>

            <div className="p-4 space-y-6">
                
                {isVisible('continueReading') && lastRead && (
                    <div className="bg-green-600/90 text-white rounded-xl p-4 shadow-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold">هل تريد المتابعة من حيث توقفت؟</p>
                            <p className="text-sm">{`كنت تقرأ سورة ${lastRead.surahName} الآية رقم ${lastRead.ayahInSurah}`}</p>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                            <button onClick={handleContinueReading} className="bg-white/30 px-4 py-1.5 rounded-md text-sm font-semibold">متابعة</button>
                             <button onClick={clearLastReadPosition} className="bg-white/10 px-4 py-1.5 rounded-md text-sm">اخفاء</button>
                        </div>
                    </div>
                )}
                
                {isVisible('khatma') && (
                    <DailyCard title="ختمة">
                        {khatmaPlan ? (
                            <div>
                                <div className="flex justify-between items-center text-gray-300 mb-3">
                                    <p>التقدم: {khatmaPlan.completedSections} / {khatmaPlan.sections.length}</p>
                                    <p className="font-semibold text-green-300">القسم {khatmaPlan.completedSections + 1}</p>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(khatmaPlan.completedSections / khatmaPlan.sections.length) * 100}%` }}></div>
                                </div>
                                <button onClick={goToKhatma} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                                    متابعة الختمة
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="mb-3 text-gray-400">ابدأ ختمة جديدة وتتبع تقدمك.</p>
                                <button onClick={goToKhatma} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                                    البدء في خطة ختمة
                                </button>
                            </div>
                        )}
                    </DailyCard>
                )}

                {isVisible('habitTracker') && (
                     <DailyCard title="متعقب العادة">
                        <HabitTracker showOverlay={showOverlay} />
                    </DailyCard>
                )}

                {isVisible('ayah') && ayah && (
                    <DailyCard title="آية اليوم" onShare={() => handleShare(ayah.text, 'آية اليوم')}>
                        <p className="text-lg leading-relaxed">{ayah.text} <span className="text-green-400">({ayah.surahName}: {ayah.numberInSurah})</span></p>
                    </DailyCard>
                )}

                {isVisible('hadith') && hadith && (
                    <DailyCard title="حديث اليوم" onShare={() => handleShare(hadith.text, 'حديث اليوم')}>
                        <p className="text-lg leading-relaxed">{hadith.text}</p>
                        <p className="text-left text-sm text-gray-400 mt-2">{hadith.narrator}</p>
                    </DailyCard>
                )}

                {isVisible('dua') && dua && (
                    <DailyCard title="دعاء اليوم" onShare={() => handleShare(dua.text, 'دعاء اليوم')}>
                        <p className="text-lg leading-relaxed">{dua.text}</p>
                    </DailyCard>
                )}
                
                {isVisible('asmaulhusna') && asmaulHusna && (
                     <DailyCard title="أسماء الله الحسنى" onShare={() => handleShare(`${asmaulHusna.name}: ${asmaulHusna.explanation}`, 'أسماء الله الحسنى')}>
                        <div className="text-center">
                            <h2 className="text-5xl font-amiri-quran text-green-300">{asmaulHusna.name}</h2>
                            <p className="mt-2 text-gray-300">{asmaulHusna.explanation}</p>
                        </div>
                    </DailyCard>
                )}

                <div className="text-center">
                    <button onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-2 bg-gray-700 text-green-400 rounded-full font-semibold hover:bg-gray-600 transition">
                        <PencilIcon className="w-4 h-4" />
                        <span>تعديل الصفحة</span>
                    </button>
                </div>

                {isVisible('shortcuts') && (
                    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
                        <h3 className="font-bold text-lg text-green-400 mb-4">الاختصارات</h3>
                        <div className="grid grid-cols-5 gap-2 text-center">
                            {shortcuts.map(shortcut => (
                                <button key={shortcut.name} onClick={shortcut.action} className="flex flex-col items-center space-y-2 focus:outline-none focus:scale-105 transition-transform">
                                    <div className="bg-gray-700 w-14 h-14 rounded-full flex items-center justify-center">{shortcut.icon}</div>
                                    <span className="text-xs font-medium text-gray-300">{shortcut.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isVisible('dailyQuestion') && (
                    <DailyCard title="سؤال اليوم">
                        <p className="font-semibold mb-3 text-gray-200">أي الذنب أعظم عند الله؟</p>
                        <div className="space-y-2 text-gray-300">
                             {['القتل', 'الشرك', 'السحر'].map((answer, i) => (
                                <div key={i} className="flex items-center space-x-3 space-x-reverse bg-gray-700/50 p-3 rounded-lg">
                                    <input type="radio" name="quiz" id={`q${i}`} className="form-radio text-green-500 bg-gray-800 border-gray-600 focus:ring-green-500" />
                                    <label htmlFor={`q${i}`}>{answer}</label>
                                </div>
                             ))}
                        </div>
                    </DailyCard>
                )}

            </div>
        </div>
    );
};

export default HomePage;