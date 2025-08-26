import React from 'react';
import Header from '../components/Header';
import { athkarCategories } from '../constants';
import { useStatistics } from '../hooks/useStatistics';

interface StatisticsPageProps {
  onClose: () => void;
}

const StatCard: React.FC<{ title: string; sessionCount: number; }> = ({ title, sessionCount }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg text-green-400 mb-2">{title}</h3>
        <div className="space-y-1 text-sm text-gray-400">
            <p><span className="font-semibold text-gray-300">عدد مرات القراءة:</span> {sessionCount}</p>
        </div>
    </div>
);


const StatisticsPage: React.FC<StatisticsPageProps> = ({ onClose }) => {
    const { getStats, resetStats } = useStatistics();
    const stats = getStats();

    const totalAthkarSessions = Object.values(stats.athkarSessions).reduce((sum, count) => sum + count, 0);

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="إحصائيات" onBack={onClose} showSettings={false} />
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                
                {/* Total Athkar Card */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold text-green-400 mb-4">ملخص العبادات</h2>
                    <div className="grid grid-cols-2 gap-4 text-gray-300">
                        <div className="text-center bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-sm">إجمالي التسبيحات</p>
                            <span className="font-semibold text-3xl text-green-400">{stats.totalTasbeehCount.toLocaleString('ar')}</span>
                        </div>
                        <div className="text-center bg-gray-700/50 p-3 rounded-lg">
                             <p className="text-sm">جلسات الأذكار</p>
                            <span className="font-semibold text-3xl text-green-400">{totalAthkarSessions.toLocaleString('ar')}</span>
                        </div>
                    </div>
                </div>

                {/* Individual Category Cards */}
                <h3 className="text-lg font-bold text-green-400 px-2">إحصائيات الأذكار</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {athkarCategories.map(cat => (
                        <StatCard 
                            key={cat.id}
                            title={cat.title}
                            sessionCount={stats.athkarSessions[cat.id] || 0}
                        />
                    ))}
                </div>

                <div className="pt-4 text-center">
                    <button 
                        onClick={resetStats}
                        className="px-6 py-2 bg-red-800/80 text-red-200 rounded-full font-semibold hover:bg-red-700 transition"
                    >
                        إعادة تعيين الإحصائيات
                    </button>
                </div>

            </div>
        </div>
    );
};

export default StatisticsPage;