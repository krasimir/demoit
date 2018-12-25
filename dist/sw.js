const version = '4.14.0';

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open('demoit.app')
      .then(cache =>
        cache.addAll([
          '/static/styles.css',
          '/static/script.js',
          '/static/demoit/styles.css',
          '/static/demoit/demoit.js',
          '/e/resources/editor.js'
        ])
      )
  )
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});