import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { athkarCategories } from '../constants';
import type { Zikr } from '../types';
import { useStatistics } from '../hooks/useStatistics';
import CompletionModal from '../components/CompletionModal';
import ZikrCard from '../components/ZikrCard';
import { useAthkarSettings } from '../hooks/useAthkarSettings';
import { useCustomizableAthkar } from '../hooks/useCustomizableAthkar';
import AthkarSettingsModal from '../components/AthkarSettingsModal';
import EditZikrModal from '../components/EditZikrModal';
import ConfirmExitModal from '../components/ConfirmExitModal';
import { PencilIcon, AdjustmentsIcon } from '../components/Icons';

const AthkarDetailsPage: React.FC<{ categoryId: string; onBack: () => void }> = ({ categoryId, onBack }) => {
    const category = athkarCategories.find(c => c.id === categoryId);
    const { logAthkarCategoryRead } = useStatistics();
    
    const { settings, updateSetting } = useAthkarSettings();
    const { athkar, addZikr, updateZikr, deleteZikr } = useCustomizableAthkar(categoryId);
    
    const [completedZikrIds, setCompletedZikrIds] = useState<Set<string | number>>(new Set());
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [zikrToEdit, setZikrToEdit] = useState<Zikr | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

    const handleZikrComplete = (zikrId: string | number) => {
        const newCompleted = new Set(completedZikrIds).add(zikrId);
        setCompletedZikrIds(newCompleted);

        if (newCompleted.size === athkar.length) {
            logAthkarCategoryRead(categoryId);
            setShowCompletionModal(true);
        }
    };
    
    const handleBack = () => {
        if (settings.confirmOnExit && completedZikrIds.size < athkar.length && completedZikrIds.size > 0 && !isEditMode) {
            setIsExitConfirmOpen(true);
        } else {
            onBack();
        }
    };
    
    const visibleAthkar = useMemo(() => {
        if (settings.hideOnZero && !isEditMode) {
            return athkar.filter(z => !completedZikrIds.has(z.id));
        }
        return athkar;
    }, [athkar, settings.hideOnZero, completedZikrIds, isEditMode]);

    const handleSaveZikr = (zikrData: Omit<Zikr, 'id' | 'category'>) => {
        if (zikrToEdit) {
            const updatedZikr: Zikr = {
                id: zikrToEdit.id,
                category: zikrToEdit.category,
                ...zikrData
            };
            updateZikr(updatedZikr);
        } else {
            addZikr(zikrData);
        }
    };
    
    const handleEdit = (zikr: Zikr) => {
        setZikrToEdit(zikr);
        setIsEditModalOpen(true);
    };
    
    const handleAddClick = () => {
        setZikrToEdit(null);
        setIsEditModalOpen(true);
    };

    const headerActions = (
        <div className="flex items-center space-x-2 space-x-reverse">
            <button onClick={() => setIsEditMode(!isEditMode)} className={`p-2 rounded-full transition-colors ${isEditMode ? 'bg-green-500/30' : ''}`}>
                <PencilIcon className={`w-6 h-6 ${isEditMode ? 'text-green-400' : 'text-gray-300'}`} />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2">
                <AdjustmentsIcon className="w-6 h-6 text-gray-300" />
            </button>
        </div>
    );

    return (
        <div>
            <Header title={category?.title || 'أذكار'} onBack={handleBack} showSettings={false} actions={headerActions} />
             <div className={`p-4 pb-24 ${settings.displayMode === 'horizontal' ? 'flex overflow-x-auto space-x-4 space-x-reverse' : ''}`}>
                {visibleAthkar.map(zikr => 
                     <div key={zikr.id} className={`${settings.displayMode === 'horizontal' ? 'flex-shrink-0 w-[90vw] snap-center' : ''}`}>
                        <ZikrCard 
                            zikr={zikr} 
                            onZikrComplete={handleZikrComplete} 
                            vibrateOnZero={settings.vibrateOnZero}
                            countOnPress={settings.countOnPress}
                            fontSize={settings.fontSize}
                            isEditMode={isEditMode}
                            onEdit={handleEdit}
                            onDelete={deleteZikr}
                        />
                    </div>
                )}
            </div>
            
            {isEditMode && (
                 <button
                    onClick={handleAddClick}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-4xl font-light hover:bg-green-700 transform hover:scale-110 transition-all z-10"
                >
                    +
                </button>
            )}

            {showCompletionModal && (
                <CompletionModal
                    title="ما شاء الله"
                    message="لقد انهيت الأذكار"
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

            {isEditModalOpen && (
                <EditZikrModal
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveZikr}
                    zikrToEdit={zikrToEdit}
                    onDelete={deleteZikr}
                />
            )}
            
            {isExitConfirmOpen && (
                <ConfirmExitModal
                    onConfirm={() => { setIsExitConfirmOpen(false); onBack(); }}
                    onCancel={() => setIsExitConfirmOpen(false)}
                />
            )}
        </div>
    );
};


const AthkarListPage: React.FC<{ onSelectCategory: (id: string) => void }> = ({ onSelectCategory }) => {
    return (
        <div>
            <Header title="أذكار المسلم" />
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {athkarCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className="bg-gray-800 p-4 rounded-lg shadow-md text-center font-semibold text-lg text-gray-200 hover:bg-green-900/50 transition duration-200"
                    >
                        {category.title}
                    </button>
                ))}
            </div>
        </div>
    );
};


const AthkarPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (selectedCategory) {
    return <AthkarDetailsPage categoryId={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return <AthkarListPage onSelectCategory={setSelectedCategory} />;
};


export default AthkarPage;
