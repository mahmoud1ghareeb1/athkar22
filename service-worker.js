const CACHE_NAME = 'athkari-v2';
const urlsToCache = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './metadata.json',
  './components/BottomNav.tsx',
  './components/Header.tsx',
  './components/Icons.tsx',
  './components/AyahActionMenu.tsx',
  './components/AudioPlayer.tsx',
  './components/SurahHeader.tsx',
  './components/QuranSettingsModal.tsx',
  './components/EditHomepageModal.tsx',
  './components/CompletionModal.tsx',
  './components/AddTasbeehModal.tsx',
  './components/ZikrCard.tsx',
  './components/AthkarSettingsModal.tsx',
  './components/EditZikrModal.tsx',
  './components/ConfirmExitModal.tsx',
  './components/GoToModal.tsx',
  './components/TafsirModal.tsx',
  './pages/HomePage.tsx',
  './pages/QuranPage.tsx',
  './pages/AthkarPage.tsx',
  './pages/MessagesPage.tsx',
  './pages/MorePage.tsx',
  './pages/AsmaulHusnaPage.tsx',
  './pages/SettingsPage.tsx',
  './pages/StatisticsPage.tsx',
  './pages/FeelingPage.tsx',
  './pages/TasbeehListPage.tsx',
  './pages/TasbeehCounterPage.tsx',
  './pages/QiblaPage.tsx',
  './pages/PrayerTimesPage.tsx',
  './pages/AddHabitPage.tsx',
  './pages/ProphetsDuasPage.tsx',
  './pages/AlhamdPage.tsx',
  './pages/QuranicDuasPage.tsx',
  './pages/IstighfarPage.tsx',
  './pages/GenericZikrPage.tsx',
  './hooks/useBookmarks.ts',
  './hooks/useShare.ts',
  './hooks/useQuranSettings.ts',
  './hooks/useLastReadPosition.ts',
  './hooks/useHomepageSettings.ts',
  './hooks/useStatistics.ts',
  './hooks/useTasbeeh.ts',
  './hooks/useLongPress.ts',
  './hooks/useKhatmaProgress.ts',
  './hooks/useKhatma.ts',
  './hooks/useHabits.ts',
  './hooks/useAthkarSettings.ts',
  './hooks/useCustomizableAthkar.ts',
  './data/daily-content.ts',
  './data/asma-ul-husna.ts',
  './data/quran-pages.ts',
  './data/feelings-data.ts',
  './data/quranic-duas.ts',
  './data/prophets-duas.ts',
  './data/alhamd-duas.ts',
  './data/istighfar-duas.ts',
  './data/tafsir-ibn-kathir.ts',
  './services/quranApi.ts',
  './services/prayerTimesApi.ts',
  './services/khatmaPlanner.ts',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Tajawal:wght@400;500;700&display=swap',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react-dom@^19.1.1/client',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return Promise.all(
            urlsToCache.map(url => {
                return cache.add(url).catch(err => {
                    console.warn(`Failed to cache ${url}: ${err}`);
                });
            })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network-only for API calls
  if (url.hostname === 'api.alquran.cloud' || url.hostname === 'api.aladhan.com' || url.hostname === 'everyayah.com') {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Cache-first strategy for all other requests
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || (response.status !== 200 && response.type !== 'opaque') || response.type === 'error') {
              return response;
            }

            let responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
