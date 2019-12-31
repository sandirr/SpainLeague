importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/script.js', revision: '1' },
  { url: '/js/nav.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/api.js', revision: '1' },
  { url: '/push.js', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/package-lock.json', revision: '1' },
  { url: '/icon.png', revision: '1' },
  { url: '/img/icon.png', revision: '1' },
  { url: '/img/icon2.png', revision: '1' },
  { url: '/article.html', revision: '1' },
]);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
)

// Menyimpan cache untuk file font selama 1 tahun
workbox.routing.registerRoute(
  // /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/api\.football-data\.org\/v2/,
  workbox.strategies.cacheFirst({
    cacheName: 'footbal-data',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerRoute(
  // /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/fonts\.googleapis\.com\/icon/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'icon-data',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

self.addEventListener('push', event => {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
