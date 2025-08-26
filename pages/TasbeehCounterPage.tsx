import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { ResetIcon, ChevronRightIcon } from '../components/Icons';
import type { TasbeehItem } from '../types';
import { useStatistics } from '../hooks/useStatistics';

interface TasbeehCounterPageProps {
    tasbeehItem: TasbeehItem;
    onClose: (currentTotal: number) => void;
}

const TasbeehCounterPage: React.FC<TasbeehCounterPageProps> = ({ tasbeehItem, onClose }) => {
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(tasbeehItem.totalCount);
    const [sessionCount, setSessionCount] = useState(0);
    const { logTasbeeh } = useStatistics();

    const increment = () => {
        const newCount = count + 1;
        const newTotal = total + 1;
        const newSessionCount = sessionCount + 1;

        if (newCount === tasbeehItem.targetCount) {
             // Vibrate on cycle completion
            if ('vibrate' in navigator) navigator.vibrate(200);
            setCount(0);
        } else {
            // Vibrate on normal click
            if ('vibrate' in navigator) navigator.vibrate(50);
            setCount(newCount);
        }
        setTotal(newTotal);
        setSessionCount(newSessionCount);
    };

    const resetSession = () => {
        setCount(0);
    };
    
    // Save progress on unmount
    const latestTotal = useRef(total);
    const latestSessionCount = useRef(sessionCount);
    useEffect(() => {
        latestTotal.current = total;
        latestSessionCount.current = sessionCount;
    }, [total, sessionCount]);

    useEffect(() => {
        return () => {
            onClose(latestTotal.current);
            if (latestSessionCount.current > 0) {
                logTasbeeh(latestSessionCount.current);
            }
        };
    }, [onClose, logTasbeeh]);


    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
            <Header title={tasbeehItem.text} onBack={() => onClose(total)} showSettings={false} />
            <div className="flex-grow flex flex-col items-center justify-between p-4 text-center">
                <div className="w-full bg-gray-800 p-4 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-400 mb-4">{tasbeehItem.benefit}</h2>
                    <div className="grid grid-cols-3 gap-2 text-center text-lg">
                        <div>
                            <p className="font-semibold text-gray-400">مرات</p>
                            <p className="font-bold text-2xl text-green-400">{sessionCount}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-400">العدد</p>
                            <p className="font-bold text-2xl text-green-400">{tasbeehItem.targetCount}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-400">الدورات</p>
                            <p className="font-bold text-2xl text-green-400">{Math.floor(sessionCount / tasbeehItem.targetCount)}</p>
                        </div>
                    </div>
                </div>

                <div 
                    onClick={increment}
                    className="relative w-64 h-64 flex items-center justify-center rounded-full bg-cover bg-center shadow-2xl active:scale-95 transition-transform cursor-pointer"
                    style={{ backgroundImage: "url('https://i.imgur.com/3g2932S.jpeg')"}}
                >
                    <div className="absolute inset-0 bg-black/40 rounded-full"></div>
                    <span className="relative text-7xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{count}</span>
                </div>
                
                <div className="w-full flex justify-around items-center">
                     <button onClick={() => onClose(total)} className="p-4 rounded-full bg-gray-800 shadow-md">
                        <ChevronRightIcon className="h-6 w-6 text-green-400" />
                    </button>
                    <p className="text-gray-300">الإجمالي: {total}</p>
                    <button onClick={resetSession} className="p-4 rounded-full bg-gray-800 shadow-md">
                        <ResetIcon className="w-6 h-6 text-green-400" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TasbeehCounterPage;