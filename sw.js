// Service Worker for Gakuensai PWA
// Provides offline access to key pages and assets

var CACHE_NAME = 'gakuensai-v1';
var ASSETS_TO_CACHE = [
    '/',
    '/index.php',
    '/assets/css/reset.css',
    '/assets/css/toppage.css',
    '/assets/css/header.css',
    '/assets/css/footer.css',
    '/assets/js/menu.js',
    '/assets/js/loading.js',
    '/assets/js/calendar.js',
    '/assets/js/concept-link-stars.js',
    '/materials/header_title.webp',
    '/materials/enjitsu78th.webp',
    '/materials/kujira.webp',
    '/materials/text_78th.webp',
    '/materials/text_kanji_gakuensai.webp',
    '/materials/text_kanji_amagakeru.webp',
    '/materials/text_kanji_amagakeru_yoko.webp',
    '/materials/text_catchcopy.webp',
    '/materials/NowLoading.webp',
    '/materials/cashless-brandlogo.webp',
    '/pages/concept.php',
    '/pages/cashless.php',
    '/pages/access.php',
    '/pages/sitemap.php',
    '/pages/comingsoon.php',
    '/assets/css/concept.css',
    '/assets/css/cashless.css',
    '/assets/css/access.css',
    '/assets/css/comingsoon.css',
    '/assets/css/sitemap.css',
    '/assets/js/concept.js'
];

// Install: cache essential assets
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('[SW] Caching app shell');
            return cache.addAll(ASSETS_TO_CACHE).catch(function(err) {
                console.log('[SW] Some assets failed to cache:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    console.log('[SW] Deleting old cache:', name);
                    return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: network-first strategy with cache fallback
self.addEventListener('fetch', function(event) {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip cross-origin requests (API calls, Google Fonts, etc.)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request).then(function(networkResponse) {
            // Clone and cache the fresh response
            if (networkResponse && networkResponse.status === 200) {
                var responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
        }).catch(function() {
            // Network failed, try cache
            return caches.match(event.request).then(function(cachedResponse) {
                if (cachedResponse) {
                    return cachedResponse;
                }
                // If no cache match for navigation, return the cached index
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});
