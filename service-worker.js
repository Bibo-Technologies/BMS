self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('your-app-cache').then(cache => {
      return cache.addAll([
        '/', // Cache the root URL
        '/index.html',  
        '/index.js',     
        '/clinical.html',
        '/clinical.js',
        '/doctors.html', 
        '/doctors.js',
        '/insurance.html',
        '/insurance.js',
        '/laboratory.html',
        '/laboratory.js',
        '/medicines.html',
        '/medicines.js',
        '/odp.html',
        '/odp.js',
        '/patients.html',
        '/patients.js',
        '/portal.css',
        '/portal.js',
        '/revenue.html',
        '/revenue.js',
        '/sales.html',
        '/sales.js',
        '/staff.html',
        '/staff.js',
        '/tests.html',
        '/tests.js',
        '/sanyu.png',
        '/service-worker.js',
        
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
