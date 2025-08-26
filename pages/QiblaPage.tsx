import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { CompassIcon, QiblaArrowIcon } from '../components/Icons';

interface QiblaPageProps {
  onClose: () => void;
}

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

const QiblaPage: React.FC<QiblaPageProps> = ({ onClose }) => {
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [heading, setHeading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('يرجى تمكين الوصول للموقع والبوصلة...');
  const isIOS = typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function';

  const calculateQiblaDirection = (lat: number, lon: number) => {
    const toRadians = (deg: number) => deg * (Math.PI / 180);
    const lat1 = toRadians(lat);
    const lon1 = toRadians(lon);
    const lat2 = toRadians(KAABA_LAT);
    const lon2 = toRadians(KAABA_LON);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let brng = Math.atan2(y, x);
    brng = brng * (180 / Math.PI); // to degrees
    brng = (brng + 360) % 360;
    return brng;
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let currentHeading = event.alpha;
    if (typeof (event as any).webkitCompassHeading !== 'undefined') {
      currentHeading = (event as any).webkitCompassHeading; // For iOS
    }
    if (currentHeading !== null) {
      setHeading(currentHeading);
      setStatus('قم بتوجيه جهازك حتى يتطابق السهم مع الخط الشمالي.');
    } else {
        setError('لا يمكن الوصول إلى بيانات البوصلة. قد لا يكون جهازك مدعومًا.');
    }
  };

  const setupListeners = () => {
    window.addEventListener('deviceorientation', handleOrientation);
  };

  const requestPermissionsAndStart = async () => {
      setStatus('جاري طلب الأذونات...');
      if (isIOS) {
          try {
              const permission = await (DeviceOrientationEvent as any).requestPermission();
              if (permission !== 'granted') {
                  setError('تم رفض إذن الوصول إلى مستشعر البوصلة.');
                  setStatus('تم رفض إذن الوصول إلى مستشعر البوصلة.');
                  return;
              }
          } catch (err) {
              setError('حدث خطأ أثناء طلب إذن البوصلة.');
              setStatus('حدث خطأ أثناء طلب إذن البوصلة.');
              return;
          }
      }
      
      setStatus('جاري تحديد موقعك...');
      navigator.geolocation.getCurrentPosition(
          (position) => {
              const { latitude, longitude } = position.coords;
              const qibla = calculateQiblaDirection(latitude, longitude);
              setQiblaDirection(qibla);
              setupListeners();
          },
          (err) => {
              setError('لا يمكن الوصول إلى موقعك. يرجى تمكين خدمات الموقع.');
              setStatus('لا يمكن الوصول إلى موقعك. يرجى تمكين خدمات الموقع.');
          },
          { enableHighAccuracy: true }
      );
  };

  useEffect(() => {
    requestPermissionsAndStart();
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const rotation = qiblaDirection - heading;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
      <Header title="بوصلة القبلة" onBack={onClose} showSettings={false} />
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 space-y-6">
        <p className="text-lg text-gray-400 h-12">{error || status}</p>

        <div className="relative w-72 h-72">
          <CompassIcon className="w-full h-full text-gray-700" />
          <div
            className="absolute inset-0 transition-transform duration-500"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-1/2 bg-green-500 rounded-t-full origin-bottom"></div>
            <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-4 h-4 text-green-500 font-bold">N</div>
          </div>

          <div 
            className="absolute top-0 left-1/2 w-1 h-full -translate-x-1/2 transition-transform duration-200"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
             <QiblaArrowIcon className="absolute top-1/2 left-1/2 w-16 h-16 text-yellow-400 -translate-x-1/2 -translate-y-1/2 opacity-80" style={{ transform: `rotate(${heading - rotation}deg)`}}/>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
          </div>
        </div>

        {error && isIOS && (
            <button
                onClick={requestPermissionsAndStart}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
            >
                أعد المحاولة
            </button>
        )}
      </div>
    </div>
  );
};

export default QiblaPage;
