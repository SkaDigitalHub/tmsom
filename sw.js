const CACHE_NAME = 'TMSOM-App-v1';  // ← Versioned for updates
const urlsToCache = [
  './',                // Relative to the service worker's path
  './index.html',
  './logo/main.png',
  './css/main.css'
  '/reg/script.js'
  './styles.css'
  '/script.js'
  // Add other critical assets (CSS, JS, etc.)
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.log('Cache install error:', err))
  );
});

// Fetch: Cache-first, then network fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached file if found
        if (response) return response;
        // Otherwise fetch, then cache the new response
        return fetch(event.request).then((fetchResponse) => {
          if (!fetchResponse || fetchResponse.status !== 200) return fetchResponse;
          // Clone the response to cache it
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return fetchResponse;
        });
      })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});
