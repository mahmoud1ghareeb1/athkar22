import React from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { fetchNotifications, getPublicUrl, NotificationItem, NotificationType, subscribeNotifications } from '../services/notifications';

const FILTERS: (NotificationType | 'all')[] = ['all', 'text', 'image', 'video', 'audio'];

const MessagesPage: React.FC = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { setItems(await fetchNotifications(filter)); } catch (e) { setError('تعذر تحميل الإشعا��ات (تحقق من إعدادات Supabase)'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        cleanup = await subscribeNotifications((n) => setItems((prev) => [n, ...prev]));
      } catch (e) {
        console.warn('Realtime disabled until Supabase config is set');
      }
    })();
    return () => { if (cleanup) cleanup(); };
  }, []);

  const content = useMemo(() => {
    if (loading) return <div className="p-8 text-center text-gray-400">جاري التحميل...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;
    if (!items.length) return <div className="p-8 text-center text-gray-400">لا يوجد إشعارات.</div>;
    return (
      <div className="space-y-3 p-4">
        {items.map((n) => {
          const url = getPublicUrl(n.media_bucket, n.media_path);
          return (
            <div key={n.id} className="bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-100 font-semibold">{n.title || 'بدون عنوان'}</h3>
                <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              {n.body && <p className="text-gray-300 mb-3 whitespace-pre-wrap">{n.body}</p>}
              {n.type === 'image' && url && (
                <img src={url} alt={n.title || 'صورة'} className="w-full rounded-lg" />
              )}
              {n.type === 'video' && url && (
                <video controls className="w-full rounded-lg bg-black">
                  <source src={url} />
                </video>
              )}
              {n.type === 'audio' && url && (
                <audio controls className="w-full">
                  <source src={url} />
                </audio>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [items, loading, error]);

  return (
    <div className="flex flex-col h-full">
      <Header title="رسائل أذكاري" />
      <div className="px-4 py-2 flex gap-2 overflow-x-auto border-b border-gray-800 bg-gray-900">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${filter === f ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {f === 'all' ? 'الكل' : f === 'text' ? 'نص' : f === 'image' ? 'صورة' : f === 'video' ? 'فيديو' : 'صوت'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-900">{content}</div>
    </div>
  );
};

export default MessagesPage;
