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
