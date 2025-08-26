import React, { useState, useEffect } from 'react';
import type { Zikr } from '../types';

interface EditZikrModalProps {
    zikrToEdit?: Zikr | null;
    onClose: () => void;
    onSave: (zikrData: Omit<Zikr, 'id' | 'category'>) => void;
    onDelete?: (zikrId: string | number) => void;
}

const EditZikrModal: React.FC<EditZikrModalProps> = ({ zikrToEdit, onClose, onSave, onDelete }) => {
    const [description, setDescription] = useState('');
    const [text, setText] = useState('');
    const [reference, setReference] = useState('');
    const [count, setCount] = useState('33');

    const isEditMode = !!zikrToEdit;

    useEffect(() => {
        if (zikrToEdit) {
            setDescription(zikrToEdit.description || '');
            setText(zikrToEdit.text || '');
            setReference(zikrToEdit.reference || '');
            setCount(String(zikrToEdit.count || 1));
        }
    }, [zikrToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numCount = parseInt(count, 10);
        if (text && numCount > 0) {
            onSave({
                text,
                count: numCount,
                description,
                reference
            });
            onClose();
        }
    };
    
    const handleDelete = () => {
        if (onDelete && zikrToEdit) {
            onDelete(zikrToEdit.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 animate-fade-in-up border border-gray-700">
                <h2 className="text-xl font-bold text-center mb-6 text-gray-200">{isEditMode ? 'تعديل الذكر' : 'إضافة ذكر'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="pre-text" className="block text-sm font-medium text-gray-300 mb-1">ما قبل الذكر</label>
                        <input type="text" id="pre-text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="zikr-text" className="block text-sm font-medium text-gray-300 mb-1">الذكر</label>
                        <textarea id="zikr-text" value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" required />
                    </div>
                     <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-300 mb-1">ملاحظة</label>
                        <input type="text" id="note" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="count" className="block text-sm font-medium text-gray-300 mb-1">عدد الحبات</label>
                        <input type="number" id="count" value={count} onChange={(e) => setCount(e.target.value)} className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500" required />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        {isEditMode && onDelete && (
                             <button type="button" onClick={handleDelete} className="px-5 py-2 bg-red-800/80 text-red-200 rounded-md hover:bg-red-700 transition">حذف</button>
                        )}
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition">الغاء</button>
                        <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">تأكيد</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditZikrModal;
