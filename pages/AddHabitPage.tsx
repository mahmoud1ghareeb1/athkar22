import React, { useState } from 'react';
import Header from '../components/Header';
import { useHabits } from '../hooks/useHabits';

interface AddHabitPageProps {
  onClose: () => void;
}

const AddHabitPage: React.FC<AddHabitPageProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [target, setTarget] = useState(1);
    const [icon, setIcon] = useState('💪');
    const { addHabit } = useHabits();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && target > 0) {
            addHabit({ name, target, icon });
            onClose();
        }
    };

    const handleTargetChange = (amount: number) => {
        setTarget(prev => Math.max(1, prev + amount));
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title="إضافة عادة" onBack={onClose} showSettings={false} />
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between p-6 space-y-8">
                <div className="space-y-6">
                    {/* Habit Name */}
                    <div>
                        <label htmlFor="habit-name" className="block text-right text-gray-400 mb-2">اسم العادة</label>
                        <input
                            id="habit-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 focus:border-green-500 focus:ring-green-500 transition"
                            required
                        />
                    </div>

                    {/* Target */}
                    <div className="flex justify-between items-center">
                        <label className="text-gray-400">الهدف</label>
                        <div className="flex items-center space-x-4 space-x-reverse bg-gray-800 border-2 border-gray-700 rounded-lg">
                            <button type="button" onClick={() => handleTargetChange(1)} className="px-4 py-2 text-2xl text-green-400">+</button>
                            <span className="px-4 text-xl font-bold text-gray-200">{target}</span>
                            <button type="button" onClick={() => handleTargetChange(-1)} className="px-4 py-2 text-2xl text-red-400">-</button>
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="flex justify-between items-center">
                        <label className="text-gray-400">اليوم</label>
                        <span className="text-gray-200 font-semibold">كل يوم</span>
                    </div>

                    {/* Icon */}
                     <div className="flex justify-between items-center">
                        <label htmlFor="habit-icon" className="text-gray-400">الرمز</label>
                        <input
                            id="habit-icon"
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="الصق رمزًا تعبيريًا هنا"
                            maxLength={2}
                            className="w-24 bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 text-center text-2xl focus:border-green-500 focus:ring-green-500 transition"
                        />
                    </div>

                </div>
                
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition hover:bg-green-700 disabled:opacity-50"
                    disabled={!name.trim()}
                >
                    إضافة
                </button>
            </form>
        </div>
    );
};

export default AddHabitPage;