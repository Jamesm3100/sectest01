const CACHE_NAME = 'murdoch-group-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/contact.html',
    '/404.html',
    '/style.css',
    '/script.js',
    '/images/murdoch-logo.png',
    '/images/murdoch-logo3.ico',
    '/images/hero-security.jpg',
    '/images/residential-camera.jpg',
    '/images/residential-safety.jpg',
    '/images/commercial-access.jpg',
    '/images/commercial-cctv.jpg',
    '/images/industrial-perimeter.jpg',
    '/images/industrial-monitoring.jpg',
    '/images/pspl-logo.png',
    '/images/worksafe-logo.png',
    'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Fetch Event Handler
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                // Make network request and cache the response
                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the fetched response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return fallback for HTML pages
                        if (event.request.mode === 'navigate') {
                            return caches.match('/404.html');
                        }
                    });
            })
    );
}); 