import React from 'react';
import type { Page, Overlay } from '../types';
import {
  PrayTogetherIcon, GroupIcon, CogIcon, FeelingIcon, ChartBarIcon, TasbeehIcon,
  KaabaIcon, QiblaArrowIcon, MosqueIcon, HandRaisedIcon, HandThumbUpIcon, HeartIcon,
  ScrollIcon, DoveIcon, BookStackIcon, MoonIcon, LanternIcon, SparklesIcon,
  DevicePhoneMobileIcon, FacebookIcon, InstagramIcon, YouTubeIcon, LinkIcon, PencilIcon, BookOpenIcon
} from '../components/Icons';

interface MorePageProps {
  setActivePage: (page: Page) => void;
  showOverlay: (overlay: Overlay) => void;
}

const MorePage: React.FC<MorePageProps> = ({ setActivePage, showOverlay }) => {

  const menuItems = [
    { name: 'ادعو معي', icon: <PrayTogetherIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'ادعو معي' } }) },
    { name: 'حلقات الذكر', icon: <GroupIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'حلقات الذكر' } }) },
    { name: 'الإعدادات', icon: <CogIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'settings' }) },
    { name: 'أسماء الله الحسنى', icon: <span className="font-amiri-quran text-2xl text-green-300">الله</span>, action: () => showOverlay({ name: 'asmaulhusna' }) },
    { name: 'أذكار المسلم', icon: <BookOpenIcon className="w-8 h-8 text-green-300"/>, action: () => setActivePage('athkar') },
    { name: 'بماذا تشعر؟', icon: <FeelingIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'feeling' }) },
    { name: 'إحصائيات', icon: <ChartBarIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'statistics' }) },
    { name: 'المسبحة', icon: <TasbeehIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'tasbeehList' }) },
    { name: 'القرآن', icon: <KaabaIcon className="w-8 h-8 text-green-300"/>, action: () => setActivePage('quran') },
    { name: 'بوصلة القبلة', icon: <QiblaArrowIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'qibla' }) },
    { name: 'مواقيت الصلاة', icon: <MosqueIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'prayerTimes' }) },
    { name: 'تسابيح', icon: <HandRaisedIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'tasbeehList' }) },
    { name: 'استغفار', icon: <HandThumbUpIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'istighfar' }) },
    { name: 'الحمد', icon: <HeartIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'alhamd' }) },
    { name: 'أدعية قرآنية', icon: <ScrollIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'quranicDuas' }) },
    { name: 'أدعية الأنبياء', icon: <DoveIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'prophetsDuas' }) },
    { name: 'الأربعون النووية', icon: <BookStackIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'الأربعون النووية' } }) },
    { name: 'الرقية الشرعية', icon: <SparklesIcon className="w-8 h-8 text-green-300 transform -rotate-45"/>, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'الرقية الشرعية' } }) },
    { name: 'سنن الجمعة', icon: <MoonIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'سنن الجمعة' } }) },
    { name: 'رمضان', icon: <LanternIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'رمضان' } }) },
    { name: 'ختمة', icon: <SparklesIcon className="w-8 h-8 text-green-300"/>, action: () => { localStorage.setItem('quran_initial_view', 'khatma'); setActivePage('quran'); } },
    { name: 'تطبيقاتنا', icon: <DevicePhoneMobileIcon className="w-8 h-8 text-green-300"/>, action: () => showOverlay({ name: 'comingSoon', props: { featureName: 'تطبيقاتنا' } }) },
  ];

  const socialIcons = [
    { platform: 'Facebook', icon: <FacebookIcon className="w-7 h-7 text-gray-300"/> },
    { platform: 'Instagram', icon: <InstagramIcon className="w-7 h-7 text-gray-300"/> },
    { platform: 'YouTube', icon: <YouTubeIcon className="w-7 h-7 text-gray-300"/> },
    { platform: 'Share', icon: <LinkIcon className="w-7 h-7 text-gray-300"/> },
    { platform: 'Edit', icon: <PencilIcon className="w-7 h-7 text-gray-300"/> },
  ];

  return (
    <div>
      <header className="p-4 text-center bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-green-400">المزيد</h1>
      </header>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          {menuItems.map((item) => (
            <button key={item.name} onClick={item.action} className="flex flex-col items-center space-y-2 p-1 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-xs font-medium text-gray-300">{item.name}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-center space-x-6 space-x-reverse mt-8">
            {socialIcons.map(social => (
                <button key={social.platform} className="w-12 h-12 bg-gray-800 rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                    {social.icon}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MorePage;