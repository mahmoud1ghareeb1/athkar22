import React from 'react';

interface SurahHeaderProps {
  surahName: string;
  surahNumber: number;
}

const SurahHeader: React.FC<SurahHeaderProps> = ({ surahName, surahNumber }) => {
  return (
    <div className="my-6 select-none text-center">
      <div className="relative border-y-2 border-green-500 py-4">
        <div 
          className="absolute inset-0 bg-repeat bg-center opacity-5" 
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}
        ></div>
        <h2 className="text-3xl font-bold text-green-400 relative z-10 font-amiri-quran">
          سورة {surahName}
        </h2>
      </div>
      {surahNumber !== 1 && surahNumber !== 9 && (
        <p className="text-center text-2xl font-semibold my-6 font-amiri-quran text-gray-200">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
      )}
    </div>
  );
};

export default SurahHeader;