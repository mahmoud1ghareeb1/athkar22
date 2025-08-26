
import React, { useState, useEffect, useRef } from 'react';
import type { Ayah, Reciter } from '../types';
import { reciters } from '../constants';
import { PlayIcon, PauseIcon, ChevronUpIcon, ChevronDownIcon, CloseIcon, CheckIcon, ChevronRightIcon } from './Icons';

interface AudioPlayerProps {
    playlist: Ayah[];
    startAyah: Ayah;
    reciter: Reciter;
    setReciter: (reciter: Reciter) => void;
    onClose: () => void;
    onAyahChange: (ayahNumber: number | null) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist, startAyah, reciter, setReciter, onClose, onAyahChange }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isReciterListOpen, setIsReciterListOpen] = useState(false);
    const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const startIndex = playlist.findIndex(a => a.number === startAyah.number);
        setCurrentAyahIndex(startIndex >= 0 ? startIndex : 0);
    }, [playlist, startAyah]);

    const currentAyah = playlist[currentAyahIndex];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentAyah) return;

        onAyahChange(currentAyah.number);
        
        const surahPadded = String(currentAyah.surah.number).padStart(3, '0');
        const ayahPadded = String(currentAyah.numberInSurah).padStart(3, '0');
        audio.src = `https://everyayah.com/data/${reciter.identifier}/${surahPadded}${ayahPadded}.mp3`;

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error("Audio play failed on source change", error);
                        setIsPlaying(false);
                    }
                });
            }
        }
    }, [currentAyah, reciter, onAyahChange]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audio.src) return;
        
        if (isPlaying) {
            audio.play().catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Audio play failed on toggle", error);
                    setIsPlaying(false);
                }
            });
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            if (currentAyahIndex < playlist.length - 1) {
                setCurrentAyahIndex(prev => prev + 1);
            } else {
                setIsPlaying(false);
                onClose();
            }
        };
        
        audio.addEventListener('ended', handleEnded);
        return () => {
            if (audio) {
                audio.removeEventListener('ended', handleEnded);
            }
        };
    }, [currentAyahIndex, playlist.length, onClose]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const playNext = () => {
        if (currentAyahIndex < playlist.length - 1) {
            setCurrentAyahIndex(prev => prev + 1);
        }
    };

    const playPrevious = () => {
        if (currentAyahIndex > 0) {
            setCurrentAyahIndex(prev => prev - 1);
        }
    };
    
    const handleReciterChange = (newReciter: Reciter) => {
        setReciter(newReciter);
        setIsReciterListOpen(false);
    };

    if (!currentAyah) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
            <div className="bg-gray-800 shadow-lg rounded-t-2xl p-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-3">
                     <button onClick={onClose} className="p-2">
                        <CloseIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />
                    </button>
                    <div className="text-center">
                        <p className="font-bold text-lg text-green-400">{`سورة ${currentAyah.surah.name}`}</p>
                        <p className="text-sm text-gray-400">{`الآية ${currentAyah.numberInSurah}`}</p>
                    </div>
                    <div className="w-10"></div>
                </div>

                {playlist.length > 1 && (
                    <div className="flex justify-around items-center my-3">
                        <button onClick={playPrevious} className="p-2 text-gray-300 disabled:opacity-50" disabled={currentAyahIndex === 0}><ChevronRightIcon className="w-8 h-8" /></button>
                        <button onClick={togglePlay} className="p-4 rounded-full bg-green-600 text-white shadow-md">
                            {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                        </button>
                        <button onClick={playNext} className="p-2 text-gray-300 disabled:opacity-50" disabled={currentAyahIndex === playlist.length - 1}><ChevronRightIcon className="w-8 h-8 rotate-180" /></button>
                    </div>
                )}
                
                <div className="mt-4">
                     <button onClick={() => setIsReciterListOpen(!isReciterListOpen)} className="w-full flex justify-between items-center p-3 bg-gray-700 rounded-lg shadow-sm border border-gray-600">
                        <span className="font-semibold text-gray-200">{reciter.name}</span>
                        {isReciterListOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-400"/> : <ChevronDownIcon className="w-5 h-5 text-gray-400"/>}
                    </button>
                    {isReciterListOpen && (
                        <div className="mt-2 bg-gray-700 border border-gray-600 rounded-lg p-2 max-h-40 overflow-y-auto shadow-inner">
                            {reciters.map(r => (
                                <button key={r.identifier} onClick={() => handleReciterChange(r)} className={`w-full text-right p-3 rounded-md flex justify-between items-center ${reciter.identifier === r.identifier ? 'bg-green-500/20 text-green-300 font-bold' : 'hover:bg-gray-600 text-gray-200'}`}>
                                    <span>{r.name}</span>
                                    {reciter.identifier === r.identifier && <CheckIcon className="w-5 h-5 text-green-400"/>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <audio ref={audioRef} />
            </div>
        </div>
    );
};

export default AudioPlayer;
