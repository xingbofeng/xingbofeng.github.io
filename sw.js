var urlsToCache = [
  '/',
  '/index.js',
  '/style.css',
  '/favicon.ico',
  '/sw-register.js',
  '/manifest.json',
];

var CACHE_NAME = 'counterxing_blog_v2';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    }).then(function() {
      self.skipWaiting();
    })
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
    })
  );
});


self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['counterxing_blog_v2'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  )
});

self.addEventListener('push', function(event) {
  const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let mustShowNotification = true;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
          mustShowNotification = false;
          break;
        }
      }

      return mustShowNotification;
    })
    .then((mustShowNotification) => {
      if (mustShowNotification) {
        return registration.getNotifications()
          .then(notifications => {
            let options = {
              icon: './images/logo/logo512.png',
              badge: './images/logo/logo512.png'
            };
            let title = event.data.text();
            if (notifications.length) {
              options.body = `您有${notifications.length}条新消息`;
            } else {
              options.body = event.data.text();
            }
            return self.registration.showNotification(title, options);

          });
      } else {
        console.log('用户已经聚焦于当前页面，不需要推送。');
      }
    });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = self.location.origin + '/index.html';

  const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});