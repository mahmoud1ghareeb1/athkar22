import { supabase } from './supabaseClient';

export type NotificationType = 'text' | 'image' | 'video' | 'audio';

export interface NotificationItem {
  id: string;
  created_at: string;
  title: string | null;
  body: string | null;
  type: NotificationType;
  media_bucket: string | null;
  media_path: string | null;
}

export const getPublicUrl = (bucket: string | null, path: string | null): string | null => {
  if (!bucket || !path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
};

export const fetchNotifications = async (type: NotificationType | 'all', limit = 50): Promise<NotificationItem[]> => {
  let query = supabase.from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (type !== 'all') query = query.eq('type', type);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const subscribeNotifications = (onInsert: (n: NotificationItem) => void) => {
  const channel = supabase.channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
      onInsert(payload.new as NotificationItem);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};
