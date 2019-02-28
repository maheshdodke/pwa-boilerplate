// set cache name, mentioning version makes it easier to manage multiple cache for various builds.
const cacheName = 'anyname-v1';
// files we want cache
const staticAssets = [
    './',
    './index.js',
    './manifest.webmanifest',
    './index.html',
    './css/style.css',
    './js/script.js'
];

// listen install event of service worker and add files to cache
self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

// listen activate event of service worker and gets control from old service worker immediately
self.addEventListener('activate', e => {
    self.clients.claim();
});

// listen fetch event of service worker, any request to network from website will be served through service worker and if assets are present in cache then will be served through it otherwise network call will be made
self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if(url.origin === location.origin) {
        // serve assets from cache
        e.respondWith(cacheFirst(req));
        console.log("data from cache");
    } else {
        // serve assets from network
        e.respondWith(networkAndCache(req));
        console.log("data from network");
    }
});

// function to serve assets from cache
async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

// function to serve assets from network and store it in cache
async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone);
        return fresh;
    } catch(e) {
        const cached = await cache.match(req);
        return cached;
    }
}