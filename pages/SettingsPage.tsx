import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { CheckIcon } from '../components/Icons';

interface SettingsPageProps {
  onClose: () => void;
}

const useSetting = (key: string, defaultValue: boolean): [boolean, (value: boolean) => void] => {
    const [value, setValue] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to save setting ${key} to localStorage`, error);
        }
    }, [key, value]);

    return [value, setValue];
};

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
    const [autostart, setAutostart] = useSetting('setting_autostart', true);
    const [fridayNotifications, setFridayNotifications] = useSetting('setting_friday_notifications', true);

    const SettingRow: React.FC<{
        title: string;
        subtitle: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
    }> = ({ title, subtitle, checked, onChange }) => (
        <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => onChange(!checked)}
        >
            <div>
                <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
                <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
            <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${checked ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                {checked && <CheckIcon className="w-4 h-4 text-white" />}
            </div>
        </div>
    );
    

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="الإعدادات" onBack={onClose} showSettings={false} />
            <div className="flex-grow overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-sm font-bold text-green-400 uppercase px-4 mb-2">عام</h2>
                    <div className="bg-gray-800 rounded-lg shadow-md divide-y divide-gray-700">
                        <SettingRow 
                            title="بدأ التطبيق عند تشغيل الهاتف"
                            subtitle="سوف يبدأ التطبيق تلقائيا في إقلاع الجهاز. تفعيل هذا الخيار لن يسمح للتطبيق لإظهار الاشعارات عند إعادة التشغيل"
                            checked={autostart}
                            onChange={setAutostart}
                        />
                        <SettingRow
                            title="اشعارات يوم الجمعة"
                            subtitle="لتفعيل و إلغاء تفعيل اشعارات يوم الجمعة لتذكيرك بسورة الكهف والصلاة عالنبي و الأدعاء"
                            checked={fridayNotifications}
                            onChange={setFridayNotifications}
                        />
                    </div>
                </div>

                <div className="p-4">
                    <h2 className="text-sm font-bold text-green-400 uppercase px-4 mb-2">تصحيح التاريخ الهجري</h2>
                     <div className="bg-gray-800 rounded-lg shadow-md p-4">
                        <label htmlFor="hijri-correction" className="block text-lg font-semibold text-gray-200 mb-2">تغيير الواجهة</label>
                        <p className="text-sm text-gray-400">تلقائي (حسب واجهة الجهاز)</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;