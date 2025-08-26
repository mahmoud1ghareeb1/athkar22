import React from 'react';
import Header from './Header';
import { CheckIcon } from './Icons';
import type { AthkarSettings, DisplayMode } from '../hooks/useAthkarSettings';

interface AthkarSettingsModalProps {
  onClose: () => void;
  settings: AthkarSettings;
  updateSetting: <K extends keyof AthkarSettings>(key: K, value: AthkarSettings[K]) => void;
}

const settingLabels: Record<keyof Omit<AthkarSettings, 'displayMode' | 'fontSize'>, { title: string; subtitle: string }> = {
    vibrateOnZero: {
        title: "ارتجاج عند الصفر",
        subtitle: "بتفعيل هذا الخيار سيفعل الارتجاج عند وصول العداد للصفر في صفحة أذكار اليوم والليلة"
    },
    hideOnZero: {
        title: "اخفاء عند الصفر",
        subtitle: "بتفعيل هذا الخيار سيختفي الذكر عند وصول العداد للصفر في صفحة أذكار اليوم والليلة"
    },
    countOnPress: {
        title: "العد بالضغط على الذكر",
        subtitle: "بتفعيل هذا الخيار يمكنك الضغط على أي مكان على الذكر للعد"
    },
    confirmOnExit: {
        title: "تأكيد الخروج",
        subtitle: "تفعيل هذا الخيار سيمنع الخروج بالخطأ من اذكار اليوم و الليلة اثناء قرائتها في حال لم تنهي كل الأذكار و سيسألك قبل الخروج"
    }
};

const AthkarSettingsModal: React.FC<AthkarSettingsModalProps> = ({ onClose, settings, updateSetting }) => {
    
    const CheckboxRow: React.FC<{ settingKey: keyof Omit<AthkarSettings, 'displayMode' | 'fontSize'> }> = ({ settingKey }) => {
        const { title, subtitle } = settingLabels[settingKey];
        const checked = settings[settingKey];

        return (
            <div
                className="flex items-start justify-between p-4 cursor-pointer"
                onClick={() => updateSetting(settingKey, !checked)}
            >
                <div className="pr-4">
                    <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                </div>
                <div className={`flex-shrink-0 w-6 h-6 mt-1 rounded flex items-center justify-center border-2 transition-colors ${checked ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                    {checked && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
            </div>
        );
    };
    
    const RadioButton: React.FC<{ label: string, value: DisplayMode }> = ({ label, value }) => (
        <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
            <input 
                type="radio" 
                name="displayMode" 
                value={value} 
                checked={settings.displayMode === value}
                onChange={() => updateSetting('displayMode', value)}
                className="form-radio text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
            />
            <span className="text-gray-300">{label}</span>
        </label>
    );

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="خيارات العرض" onBack={onClose} showSettings={false} />
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="bg-gray-800 rounded-lg shadow-md divide-y divide-gray-700">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">خيارات العرض</h3>
                        <div className="flex items-center space-x-6 space-x-reverse">
                            <RadioButton label="عمودي" value="vertical" />
                            <RadioButton label="افقي" value="horizontal" />
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">خيارات الخط</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">حجم خط أذكار اليوم والليلة</span>
                            <div className="flex items-center space-x-2 space-x-reverse p-2 bg-gray-700 rounded-md">
                                <span className="text-sm">Aa</span>
                                <input
                                    type="range"
                                    min="16"
                                    max="32"
                                    step="1"
                                    value={settings.fontSize}
                                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value, 10))}
                                    className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-lg">Aa</span>
                            </div>
                        </div>
                    </div>

                    {Object.keys(settingLabels).map(key => (
                         <CheckboxRow key={key} settingKey={key as keyof typeof settingLabels} />
                    ))}
                </div>
            </div>
            <div className="p-4 bg-gray-900">
                 <button onClick={onClose} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                    تم
                </button>
            </div>
        </div>
    );
};

export default AthkarSettingsModal;
