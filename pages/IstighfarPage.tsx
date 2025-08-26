import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { istighfarDuas } from '../data/istighfar-duas';
import ZikrCard from '../components/ZikrCard';
import { useAthkarSettings } from '../hooks/useAthkarSettings';
import AthkarSettingsModal from '../components/AthkarSettingsModal';
import ConfirmExitModal from '../components/ConfirmExitModal';
import { AdjustmentsIcon } from '../components/Icons';

interface IstighfarPageProps {
  onClose: () => void;
}

const IstighfarPage: React.FC<IstighfarPageProps> = ({ onClose }) => {
    const sunnahDuas = istighfarDuas.filter(d => d.category === 'sunnah');
    const quranDuas = istighfarDuas.filter(d => d.category === 'quran');
    const allDuas = [...sunnahDuas, ...quranDuas];

    const { settings, updateSetting } = useAthkarSettings();
    const [completedZikrIds, setCompletedZikrIds] = useState<Set<string | number>>(new Set());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

    const handleZikrComplete = (zikrId: string | number) => {
        setCompletedZikrIds(prev => new Set(prev).add(zikrId));
    };

    const handleBack = () => {
        if (settings.confirmOnExit && completedZikrIds.size < allDuas.length && completedZikrIds.size > 0) {
            setIsExitConfirmOpen(true);
        } else {
            onClose();
        }
    };
    
    const getVisibleDuas = (duas: typeof allDuas) => {
        if (settings.hideOnZero) {
            return duas.filter(z => !completedZikrIds.has(z.id));
        }
        return duas;
    };

    const visibleSunnahDuas = useMemo(() => getVisibleDuas(sunnahDuas), [sunnahDuas, settings.hideOnZero, completedZikrIds]);
    const visibleQuranDuas = useMemo(() => getVisibleDuas(quranDuas), [quranDuas, settings.hideOnZero, completedZikrIds]);
    
    const headerActions = (
        <button onClick={() => setIsSettingsOpen(true)} className="p-2">
            <AdjustmentsIcon className="w-6 h-6 text-gray-300" />
        </button>
    );
    
    const dummyFunc = () => {};

    const renderZikrList = (list: typeof allDuas) => list.map(dua => (
        <ZikrCard 
            key={dua.id} 
            zikr={dua} 
            onZikrComplete={handleZikrComplete}
            vibrateOnZero={settings.vibrateOnZero}
            countOnPress={settings.countOnPress}
            fontSize={settings.fontSize}
            isEditMode={false}
            onEdit={dummyFunc}
            onDelete={dummyFunc}
        />
    ));

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="استغفار" onBack={handleBack} showSettings={false} actions={headerActions} />
            <div className="flex-grow overflow-y-auto p-4">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-green-400 mb-4 border-b-2 border-green-500/50 pb-2">
                        من السنة النبوية
                    </h2>
                    {visibleSunnahDuas.length > 0 ? renderZikrList(visibleSunnahDuas) : <p className="text-gray-500 text-center py-4">أكملت جميع الأذكار في هذا القسم.</p>}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-green-400 mb-4 border-b-2 border-green-500/50 pb-2">
                        من القرآن الكريم
                    </h2>
                    {visibleQuranDuas.length > 0 ? renderZikrList(visibleQuranDuas) : <p className="text-gray-500 text-center py-4">أكملت جميع الأذكار في هذا القسم.</p>}
                </div>
            </div>

            {isSettingsOpen && <AthkarSettingsModal onClose={() => setIsSettingsOpen(false)} settings={settings} updateSetting={updateSetting} />}
            {isExitConfirmOpen && <ConfirmExitModal onConfirm={() => { setIsExitConfirmOpen(false); onClose(); }} onCancel={() => setIsExitConfirmOpen(false)} />}
        </div>
    );
};

export default IstighfarPage;
