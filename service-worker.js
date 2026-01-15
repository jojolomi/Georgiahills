const CACHE_NAME = 'gh-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/arabic.html',
  '/destination.html',
  '/style.css',
  '/script.js',
  '/favicon.ico',
  '/manifest.json'
];

// 1. INSTALL: Browser downloads and saves the critical files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ACTIVATE: Clean up old caches (if you update your website)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH: Intercept network requests
// Strategy: "Stale-While-Revalidate"
// It serves the cached version immediately (fast) AND fetches a new version in the background to update the cache for next time.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Only cache valid responses (not errors)
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If network fails, we just rely on what we returned from cache
      });

      // Return cached response if found, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});