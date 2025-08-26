import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import type { Zikr } from '../types';
import CompletionModal from '../components/CompletionModal';
import ZikrCard from '../components/ZikrCard';
import { useAthkarSettings } from '../hooks/useAthkarSettings';
import AthkarSettingsModal from '../components/AthkarSettingsModal';
import ConfirmExitModal from '../components/ConfirmExitModal';
import { AdjustmentsIcon } from '../components/Icons';

interface GenericZikrPageProps {
  onClose: () => void;
  title: string;
  athkarList: Zikr[];
}

const GenericZikrPage: React.FC<GenericZikrPageProps> = ({ onClose, title, athkarList }) => {
    const { settings, updateSetting } = useAthkarSettings();
    
    const [completedZikrIds, setCompletedZikrIds] = useState<Set<string | number>>(new Set());
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

    const handleZikrComplete = (zikrId: string | number) => {
        const newCompleted = new Set(completedZikrIds).add(zikrId);
        setCompletedZikrIds(newCompleted);

        if (newCompleted.size === athkarList.length) {
            setShowCompletionModal(true);
        }
    };
    
    const handleBack = () => {
        if (settings.confirmOnExit && completedZikrIds.size < athkarList.length && completedZikrIds.size > 0) {
            setIsExitConfirmOpen(true);
        } else {
            onClose();
        }
    };
    
    const visibleAthkar = useMemo(() => {
        if (settings.hideOnZero) {
            return athkarList.filter(z => !completedZikrIds.has(z.id));
        }
        return athkarList;
    }, [athkarList, settings.hideOnZero, completedZikrIds]);

    const headerActions = (
        <button onClick={() => setIsSettingsOpen(true)} className="p-2">
            <AdjustmentsIcon className="w-6 h-6 text-gray-300" />
        </button>
    );

    const dummyFunc = () => {};

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title={title} onBack={handleBack} showSettings={false} actions={headerActions} />
            <div className={`flex-grow overflow-y-auto p-4 ${settings.displayMode === 'horizontal' ? 'flex overflow-x-auto space-x-4 space-x-reverse' : ''}`}>
                {visibleAthkar.map(zikr => 
                    <div key={zikr.id} className={`${settings.displayMode === 'horizontal' ? 'flex-shrink-0 w-[90vw] snap-center' : ''}`}>
                        <ZikrCard 
                            zikr={zikr} 
                            onZikrComplete={handleZikrComplete}
                            vibrateOnZero={settings.vibrateOnZero}
                            countOnPress={settings.countOnPress}
                            fontSize={settings.fontSize}
                            isEditMode={false} // Not editable
                            onEdit={dummyFunc}
                            onDelete={dummyFunc}
                        />
                    </div>
                )}
            </div>
            
            {showCompletionModal && (
                <CompletionModal
                    title="ما شاء الله"
                    message={`لقد انهيت ${title}`}
                    onClose={() => setShowCompletionModal(false)}
                />
            )}
            
            {isSettingsOpen && (
                <AthkarSettingsModal
                    onClose={() => setIsSettingsOpen(false)}
                    settings={settings}
                    updateSetting={updateSetting}
                />
            )}
            
            {isExitConfirmOpen && (
                <ConfirmExitModal
                    onConfirm={() => { setIsExitConfirmOpen(false); onClose(); }}
                    onCancel={() => setIsExitConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default GenericZikrPage;
