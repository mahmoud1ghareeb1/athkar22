const VERSION = '1.0.0';
const APP_SHELL_CACHE = `athkari-shell-${VERSION}`;
const RUNTIME_CACHE = `athkari-runtime-${VERSION}`;
const FONT_CACHE = `athkari-fonts-${VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![APP_SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

function networkFirst(event) {
  return event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
}

function staleWhileRevalidate(event, cacheName = RUNTIME_CACHE) {
  return event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(cacheName).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
}

function broadcastProgress(message) {
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
    for (const client of clients) client.postMessage(message);
  });
}

self.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || data.type !== 'cache-tafsir' || !Array.isArray(data.urls)) return;
  const urls = data.urls.filter(Boolean);
  const total = urls.length;
  let processed = 0;
  const cache = await caches.open(RUNTIME_CACHE);
  const CHUNK = 50;
  try {
    for (let i = 0; i < urls.length; i += CHUNK) {
      const slice = urls.slice(i, i + CHUNK);
      const results = await Promise.allSettled(
        slice.map(async (url) => {
          try {
            const already = await cache.match(url);
            if (already) return true;
            const res = await fetch(url, { cache: 'no-cache' });
            if (res && (res.ok || res.type === 'opaque')) {
              await cache.put(url, res.clone());
              return true;
            }
            return false;
          } catch {
            return false;
          }
        })
      );
      processed += results.length;
      broadcastProgress({ type: 'cache-progress', processed, total });
    }
    broadcastProgress({ type: 'cache-complete', total });
  } catch (e) {
    broadcastProgress({ type: 'cache-error', message: (e && e.message) || 'unknown' });
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // App shell for navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(APP_SHELL_CACHE).then((c) => c.put('/index.html', clone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // External APIs: network-first
  if (['api.alquran.cloud', 'api.aladhan.com', 'everyayah.com'].includes(url.hostname)) {
    return networkFirst(event);
  }

  // Google Fonts CSS: SWR
  if (url.hostname === 'fonts.googleapis.com') {
    return staleWhileRevalidate(event, RUNTIME_CACHE);
  }

  // Google Fonts files: cache-first
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((res) => {
            const clone = res.clone();
            caches.open(FONT_CACHE).then((c) => c.put(event.request, clone));
            return res;
          })
        );
      })
    );
    return;
  }

  // Tailwind CDN: SWR
  if (url.hostname === 'cdn.tailwindcss.com') {
    return staleWhileRevalidate(event, RUNTIME_CACHE);
  }

  // Transparent textures background: SWR
  if (url.hostname === 'www.transparenttextures.com') {
    return staleWhileRevalidate(event, RUNTIME_CACHE);
  }

  // Same-origin static assets: cache-first then update
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchAndCache = fetch(event.request)
          .then((res) => {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(event.request, clone));
            return res;
          })
          .catch(() => cached);
        return cached || fetchAndCache;
      })
    );
    return;
  }

  // Default: try cache, else network
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
