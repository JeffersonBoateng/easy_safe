const CACHE_NAME = 'easysafe-v1';

const APP_SHELL = [
  'auth.html',
  'index.html',
  'accounts.html',
  'categories.html',
  'transactions.html',
  'auth.css',
  'dashboard.css',
  'auth.js',
  'dashboard.js',
  'accounts.js',
  'categories.js',
  'transactions.js',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(APP_SHELL.map((file) => cache.add(file)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  // Never touch calls to the backend API (different origin): financial data stays live
  if (new URL(request.url).origin !== self.location.origin) return;

  // Network first so new deploys show up straight away; cached copy only if offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
