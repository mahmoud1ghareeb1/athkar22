import React, { useState } from 'react';

interface AddTasbeehModalProps {
    onClose: () => void;
    onAdd: (item: { text: string; benefit: string; targetCount: number }) => void;
}

const AddTasbeehModal: React.FC<AddTasbeehModalProps> = ({ onClose, onAdd }) => {
    const [text, setText] = useState('');
    const [benefit, setBenefit] = useState('');
    const [targetCount, setTargetCount] = useState('33');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const count = parseInt(targetCount, 10);
        if (text && count > 0) {
            onAdd({ text, benefit: benefit || "الفائدة", targetCount: count });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 animate-fade-in-up border border-gray-700">
                <h2 className="text-xl font-bold text-center mb-6 text-gray-200">إضافة ذكر للمسبحة</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="zikr" className="block text-sm font-medium text-gray-300 mb-1">الذكر</label>
                        <input
                            type="text"
                            id="zikr"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="benefit" className="block text-sm font-medium text-gray-300 mb-1">الفائدة</label>
                        <input
                            type="text"
                            id="benefit"
                            value={benefit}
                            onChange={(e) => setBenefit(e.target.value)}
                            placeholder="مثال: عدد الحبات"
                            className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="count" className="block text-sm font-medium text-gray-300 mb-1">عدد الحبات</label>
                        <input
                            type="number"
                            id="count"
                            value={targetCount}
                            onChange={(e) => setTargetCount(e.target.value)}
                            className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            إضافة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTasbeehModal;