/**
 * sw.js - Progressive Web App Service Worker.
 * Caches core layout files for offline reliability.
 */
const CACHE_NAME = 'flipaclip-sys-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/standalone.html',
  '/css/main.css',
  '/css/hero.css',
  '/css/animations.css',
  '/js/config.js',
  '/js/main.js',
  '/js/cursor.js',
  '/js/particles.js',
  '/images/character.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
