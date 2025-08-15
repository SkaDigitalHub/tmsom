// ===== TMSOM Service Worker =====
// Version: v2.1 (Updated caching strategy)
const CACHE_NAME = 'TMSOM-App-v2';  // Updated version forces cache refresh
const RUNTIME_CACHE = 'TMSOM-Runtime';
const OFFLINE_URL = './offline.html';  // Relative to SW location

// Core assets to cache immediately on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',  // Critical offline fallback
  './logo/main.png',
  './logo/main.png',
  './css/main.css',
  '.styles.css',
  './script.js',
  './manifest.json'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())  // Activate immediately
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache !== RUNTIME_CACHE) {
            console.log('[SW] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => self.clients.claim())  // Control all open pages
  );
});

// ===== FETCH HANDLER =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // HTML requests (Network first, with offline fallback)
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => networkResponse)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // API requests (Network first, cache fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Cache successful API responses
          const clonedResponse = networkResponse.clone();
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(request, clonedResponse));
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (Cache first, network fallback)
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => cachedResponse || fetch(request))
  );
});

// ===== OFFLINE DETECTION =====
self.addEventListener('message', (event) => {
  if (event.data.type === 'CHECK_ONLINE_STATUS') {
    fetch('./is-online.txt', { method: 'HEAD', cache: 'no-store' })
      .then(() => event.source.postMessage({ isOnline: true }))
      .catch(() => event.source.postMessage({ isOnline: false }));
  }
});


// 1. Handle incoming notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: 'logo/main.png',
    vibrate: [200, 100, 200] // Vibration pattern
  });
});

// 2. Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/overview')
  );
});



