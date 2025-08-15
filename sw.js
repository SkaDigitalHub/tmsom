// ===== TMSOM Service Worker =====
// Version: v2.2 (Optimized caching & sync)
const CACHE_NAME = 'TMSOM-App-v2';
const RUNTIME_CACHE = 'TMSOM-Runtime';
const OFFLINE_URL = '/tmsom/offline.html';  // Must match actual path

// Core assets to cache on install
const PRECACHE_ASSETS = [
  '/tmsom/',
  '/tmsom/index.html',
  OFFLINE_URL,
  '/tmsom/overview.html',
  '/tmsom/agent.html',
  '/tmsom/logo/main.png',
  '/tmsom/css/main.css',
  '/tmsom/styles.css',
  '/tmsom/script.js',
  '/tmsom/manifest.json'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching core assets');
        // Cache each asset individually to avoid failing entire install
        return Promise.all(
          PRECACHE_ASSETS.map(url => 
            cache.add(url).catch(err => 
              console.warn('[SW] Failed to cache:', url, err)
            )
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cache => 
          (cache !== CACHE_NAME && cache !== RUNTIME_CACHE) 
            ? caches.delete(cache) 
            : null
        )
      )
    )
    .then(() => self.clients.claim())
  );
});

// ===== FETCH HANDLER =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET or cross-origin requests
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // HTML: Network-first, offline fallback
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the visited page for future offline use
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => 
          caches.match(request).then(cached => 
            cached || caches.match(OFFLINE_URL)
          )
        )
    );
    return;
  }

  // API: Network-first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache API responses for offline use
          const clonedResponse = response.clone();
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: Cache-first
  event.respondWith(
    caches.match(request).then(cached => 
      cached || fetch(request)
    )
  );
});

// ===== BACKGROUND SYNC =====
const FEATURE_CACHE = 'tmsom-features-v1';
const SYNC_FEATURES = [
  '/tmsom/index.html',
  '/tmsom/overview.html',
  '/tmsom/agent.html'
];

self.addEventListener('sync', event => {
  if (event.tag === 'sync-features') {
    event.waitUntil(
      caches.open(FEATURE_CACHE)
        .then(cache => 
          Promise.all(
            SYNC_FEATURES.map(url => 
              fetch(url)
                .then(res => cache.put(url, res))
                .catch(err => console.warn('[SW] Sync failed for:', url, err))
          )
        )
        .then(() => notifyClients('Features updated!'))
    );
  }
});

// ===== PERIODIC SYNC (Requires Periodic Background Sync API) =====
self.addEventListener('periodicsync', event => {
  if (event.tag === 'daily-update') {
    event.waitUntil(updateFeatures());
  }
});

async function updateFeatures() {
  const cache = await caches.open(FEATURE_CACHE);
  await Promise.all(
    SYNC_FEATURES.map(url => 
      fetch(url)
        .then(res => cache.put(url, res))
        .catch(err => console.warn('[SW] Update failed:', url, err))
    )
  );
  await notifyClients("New content available!");
}

// Notify all open clients
function notifyClients(message) {
  return self.clients.matchAll()
    .then(clients => 
      clients.forEach(client => 
        client.postMessage({ type: 'toast', message })
      )
    );
}

// ===== NOTIFICATION HANDLING =====
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'join') {
    clients.openWindow('/tmsom/enter.html');
  } else if (event.action === 'snooze') {
    event.waitUntil(
      self.registration.showNotification("Reminder Set", {
        body: "I'll remind you again in 10 minutes",
        icon: '/tmsom/logo/main.png'
      })
    );
  }
});
