import React, { useState, useEffect } from 'react';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { CheckIcon } from '../components/Icons';
import { getTafsirUrls } from '../offline/tafsirManifest';

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

    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        const onMsg = (e: MessageEvent) => {
            const data = e.data;
            if (!data || typeof data !== 'object') return;
            if (data.type === 'cache-progress' && typeof data.total === 'number') {
                setTotal(data.total);
                const pct = Math.min(100, Math.floor(((data.processed || 0) / (data.total || 1)) * 100));
                setProgress(pct);
                setStatus(`جاري تنزيل التفسير: ${pct}%`);
            }
            if (data.type === 'cache-complete') {
                setProgress(100);
                setStatus('اكتمل تنزيل التفسير');
                setDownloading(false);
            }
            if (data.type === 'cache-error') {
                setStatus('حدث خطأ أثناء التنزيل');
                setDownloading(false);
            }
        };
        navigator.serviceWorker?.addEventListener('message', onMsg);
        return () => navigator.serviceWorker?.removeEventListener('message', onMsg);
    }, []);

    const handleDownloadTafsir = async () => {
        try {
            const urls = getTafsirUrls();
            if (!('serviceWorker' in navigator)) {
                setStatus('المتصفح لا يدعم Service Worker');
                return;
            }
            setDownloading(true);
            setStatus('بدء تنزيل التفسير...');
            setProgress(0);
            setTotal(urls.length);
            const reg = await navigator.serviceWorker.ready;
            reg.active?.postMessage({ type: 'cache-tafsir', urls });
        } catch (e) {
            setStatus('تعذر بدء التنزيل');
            setDownloading(false);
        }
    };

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
                    <h2 className="text-sm font-bold text-green-400 uppercase px-4 mb-2">العمل دون إنترنت</h2>
                    <div className="bg-gray-800 rounded-lg shadow-md p-4 space-y-3">
                        <p className="text-sm text-gray-400">نزّل جميع ملفات تفسير السعدي للعمل الكامل دون إنترنت.</p>
                        <button
                          onClick={handleDownloadTafsir}
                          disabled={downloading}
                          className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition ${downloading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          {downloading ? 'جاري التنزيل...' : 'تنزيل التفسير الآن'}
                        </button>
                        {status && (
                          <div>
                            <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
                              <div className="bg-green-500 h-2" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{status} {total ? `(${progress}% من ${total} ملف)` : ''}</p>
                          </div>
                        )}
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
