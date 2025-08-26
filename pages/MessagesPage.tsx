import React from 'react';
import Header from '../components/Header';

const MessagesPage: React.FC = () => {
  return (
    <div>
      <Header title="رسائل أذكاري" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center text-gray-400 px-4">
        <p className="text-xl mb-2">لا يوجد رسائل أذكاري حالياً.</p>
        <p>ستظهر رسائل جديدة هنا قريباً.</p>
      </div>
    </div>
  );
};

export default MessagesPage;