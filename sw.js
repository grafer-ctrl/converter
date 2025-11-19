const CACHE_NAME = 'converter-pwa-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/game.html',
    '/manifest.json'
    // Jangan cache script iklan (Adsterra) agar iklan tetap update
];

// 1. Install Service Worker & Cache File
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Activate & Hapus Cache Lama jika ada update
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. Fetch Strategy (Stale-While-Revalidate)
// Cek cache dulu, kalau ada pakai itu, tapi tetap update di background
self.addEventListener('fetch', (event) => {
    // Abaikan request ke Adsterra atau external link agar tidak error saat offline
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
