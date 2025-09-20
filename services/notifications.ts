import { getSupabase } from './supabaseClient';

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
  // Public URL is deterministic; no need for client instance
  if (!bucket || !path) return null;
  try {
    const url = new URL(path, `${location.origin}/storage/v1/object/public/${bucket}/`).toString();
    return url;
  } catch {
    return null;
  }
};

export const fetchNotifications = async (type: NotificationType | 'all', limit = 50): Promise<NotificationItem[]> => {
  const supabase = await getSupabase();
  let query = supabase.from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (type !== 'all') query = query.eq('type', type);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const subscribeNotifications = async (onInsert: (n: NotificationItem) => void) => {
  const supabase = await getSupabase();
  const channel = supabase.channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload: any) => {
      onInsert(payload.new as NotificationItem);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};
