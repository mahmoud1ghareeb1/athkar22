import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { prophetsDuasData } from '../data/prophets-duas';
import { ChevronDownIcon, AdjustmentsIcon } from '../components/Icons';
import ZikrCard from '../components/ZikrCard';
import { useAthkarSettings } from '../hooks/useAthkarSettings';
import AthkarSettingsModal from '../components/AthkarSettingsModal';
import ConfirmExitModal from '../components/ConfirmExitModal';
import type { Zikr } from '../types';

interface ProphetsDuasPageProps {
  onClose: () => void;
}

const ProphetsDuasPage: React.FC<ProphetsDuasPageProps> = ({ onClose }) => {
  const [expandedProphet, setExpandedProphet] = useState<string | null>(prophetsDuasData[0]?.prophet || null);
  
  const { settings, updateSetting } = useAthkarSettings();
  const [completedZikrIds, setCompletedZikrIds] = useState<Set<string | number>>(new Set());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  const allDuas = useMemo(() => prophetsDuasData.flatMap(p => p.duas), []);

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
  
  const getVisibleDuas = (duas: Zikr[]) => {
      if (settings.hideOnZero) {
          return duas.filter(d => !completedZikrIds.has(d.id));
      }
      return duas;
  };

  const toggleProphet = (name: string) => {
    setExpandedProphet(expandedProphet === name ? null : name);
  };
  
  const headerActions = (
    <button onClick={() => setIsSettingsOpen(true)} className="p-2">
        <AdjustmentsIcon className="w-6 h-6 text-gray-300" />
    </button>
  );

  const dummyFunc = () => {};

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
      <Header title="أدعية الأنبياء" onBack={handleBack} showSettings={false} actions={headerActions}/>
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {prophetsDuasData.map((prophetData) => {
          const visibleDuas = getVisibleDuas(prophetData.duas);
          if (settings.hideOnZero && visibleDuas.length === 0) return null;

          return (
            <div key={prophetData.prophet} className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleProphet(prophetData.prophet)}
                className="w-full p-4 flex justify-between items-center text-right"
              >
                <h3 className="text-xl font-bold text-green-400">{prophetData.prophet}</h3>
                <ChevronDownIcon
                  className={`w-6 h-6 text-gray-400 transition-transform ${
                    expandedProphet === prophetData.prophet ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedProphet === prophetData.prophet && (
                <div className="px-4 pb-4 pt-0 space-y-3 animate-fade-in">
                  {visibleDuas.map((dua) => (
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
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isSettingsOpen && <AthkarSettingsModal onClose={() => setIsSettingsOpen(false)} settings={settings} updateSetting={updateSetting} />}
      {isExitConfirmOpen && <ConfirmExitModal onConfirm={() => { setIsExitConfirmOpen(false); onClose(); }} onCancel={() => setIsExitConfirmOpen(false)} />}
    </div>
  );
};

export default ProphetsDuasPage;
