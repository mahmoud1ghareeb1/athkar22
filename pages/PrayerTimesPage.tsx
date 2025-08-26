import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { fetchPrayerTimes, saveLocation, getSavedLocation } from '../services/prayerTimesApi';
import type { PrayerTimes, PrayerTime } from '../types';

interface PrayerTimesPageProps {
  onClose: () => void;
}

const prayerNames: Record<PrayerTime, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
};

const prayerOrder: PrayerTime[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PrayerTimesPage: React.FC<PrayerTimesPageProps> = ({ onClose }) => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [nextPrayer, setNextPrayer] = useState<{ name: PrayerTime; time: string } | null>(null);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const getTimes = async () => {
            try {
                let location = getSavedLocation();
                if (!location) {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
                    });
                    location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                    saveLocation(location);
                }
                const { times } = await fetchPrayerTimes(location.latitude, location.longitude);
                setPrayerTimes(times);
            } catch (err) {
                setError('لا يمكن الحصول على مواقيت الصلاة. يرجى التحقق من إذن الموقع واتصالك بالإنترنت.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getTimes();
    }, []);

    useEffect(() => {
        if (!prayerTimes) return;

        const interval = setInterval(() => {
            const now = new Date();
            let nextPrayerInfo: { name: PrayerTime, time: string, date: Date } | null = null;
            
            // Find next prayer for today
            for (const prayerName of prayerOrder) {
                const prayerTimeStr = prayerTimes[prayerName];
                const [hours, minutes] = prayerTimeStr.split(':').map(Number);
                const prayerDate = new Date();
                prayerDate.setHours(hours, minutes, 0, 0);

                if (prayerDate > now) {
                    nextPrayerInfo = { name: prayerName, time: prayerTimeStr, date: prayerDate };
                    break;
                }
            }

            // If all prayers for today passed, next prayer is Fajr tomorrow
            if (!nextPrayerInfo) {
                const prayerTimeStr = prayerTimes['Fajr'];
                const [hours, minutes] = prayerTimeStr.split(':').map(Number);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(hours, minutes, 0, 0);
                nextPrayerInfo = { name: 'Fajr', time: prayerTimeStr, date: tomorrow };
            }
            
            setNextPrayer({ name: nextPrayerInfo.name, time: nextPrayerInfo.time });

            // Calculate countdown
            const diff = nextPrayerInfo.date.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);

        }, 1000);

        return () => clearInterval(interval);

    }, [prayerTimes]);


    const renderContent = () => {
        if (loading) {
            return <div className="text-center text-gray-400 p-8">جاري تحميل مواقيت الصلاة...</div>;
        }
        if (error) {
            return <div className="text-center text-red-400 p-8 font-semibold">{error}</div>;
        }
        if (!prayerTimes) {
            return null;
        }

        return (
             <div className="p-4 space-y-3">
                {prayerOrder.map(prayer => (
                    <div key={prayer} className={`flex justify-between items-center p-4 rounded-lg shadow-md transition-all duration-300 ${nextPrayer?.name === prayer ? 'bg-green-800/80 border-2 border-green-500 scale-105' : 'bg-gray-800'}`}>
                        <span className={`font-bold text-lg ${nextPrayer?.name === prayer ? 'text-green-300' : 'text-gray-200'}`}>{prayerNames[prayer]}</span>
                        <span className={`font-mono text-xl tracking-wider ${nextPrayer?.name === prayer ? 'text-white font-bold' : 'text-gray-300'}`}>{prayerTimes[prayer]}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="مواقيت الصلاة" onBack={onClose} showSettings={false} />
            <div className="flex-grow overflow-y-auto">
                {nextPrayer && (
                    <div className="bg-gray-800/50 p-6 text-center shadow-lg my-4 mx-4 rounded-xl border border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-400">الصلاة القادمة</h2>
                        <p className="text-3xl font-bold text-green-400 my-1">{prayerNames[nextPrayer.name]}</p>
                        <p className="text-2xl font-mono tracking-widest text-white">{countdown}</p>
                    </div>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default PrayerTimesPage;
