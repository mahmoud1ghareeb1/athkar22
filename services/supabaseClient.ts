let _client: any | null = null;

const readEnv = () => {
  const viteEnv = (import.meta as any)?.env || {};
  const metaUrl = (typeof document !== 'undefined' && document.querySelector('meta[name="supabase-url"]')?.getAttribute('content')) || undefined;
  const metaKey = (typeof document !== 'undefined' && document.querySelector('meta[name="supabase-key"]')?.getAttribute('content')) || undefined;
  const g: any = (typeof window !== 'undefined' ? (window as any) : {});
  const url = viteEnv.VITE_SUPABASE_URL || g.__SUPABASE_URL__ || metaUrl;
  const key = viteEnv.VITE_SUPABASE_ANON_KEY || g.__SUPABASE_ANON_KEY__ || metaKey;
  return { url, key } as { url?: string; key?: string };
};

export const getSupabase = async () => {
  if (_client) return _client;
  const { url, key } = readEnv();
  if (!url || !key) {
    throw new Error('Supabase credentials missing');
  }
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
};
