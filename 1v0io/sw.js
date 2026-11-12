// 1v0.io installed from the site: always the newest build when online, the last one played when offline.
const CACHE = '1v0io-v1';
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './manifest.webmanifest', './icon-192.png'])).catch(() => {}));
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)).catch(() => {}); }
        return res;
      })
      .catch(() => caches.match(r).then((hit) => hit || (r.mode === 'navigate' ? caches.match('./') : undefined)).then((hit) => hit || Response.error())),
  );
});
