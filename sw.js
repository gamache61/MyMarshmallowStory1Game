const CACHE_NAME = 'marshmallow-story-cache-v1';
const ASSETS_TO_CACHE = [
  '/MyMarshmallowStory1Game/',
  '/MyMarshmallowStory1Game/index.html',
  '/MyMarshmallowStory1Game/manifest.json',
  '/MyMarshmallowStory1Game/icons/icon-72.png',
  '/MyMarshmallowStory1Game/icons/icon-96.png',
  '/MyMarshmallowStory1Game/icons/icon-128.png',
  '/MyMarshmallowStory1Game/icons/icon-144.png',
  '/MyMarshmallowStory1Game/icons/icon-152.png',
  '/MyMarshmallowStory1Game/icons/icon-192.png',
  '/MyMarshmallowStory1Game/icons/icon-384.png',
  '/MyMarshmallowStory1Game/icons/icon-512.png',
  '/MyMarshmallowStory1Game/icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
            }
            return response;
          })
          .catch(() => caches.match('/MyMarshmallowStory1Game/index.html'))
      );
    })
  );
});