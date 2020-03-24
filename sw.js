const staticCacheName = 'pwa-site-static-v6'
const dynamicCacheName = 'pwa-site-dynamic-v6'
const caseUrls = [
    '/',
    '/index.html',
    '/js/app.js',
    '/manifest.json',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/js/localforage.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://cdn.faceworks.nl/Assets/Fonts/Roboto/v1/RobotoRegular.woff2'
]


// install sw listener 
self.addEventListener('install', evt => {

    // cache AppShell
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching assets')
            cache.addAll(caseUrls)
        })
    )
})

// activate sw listener
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys)

            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key)))
        })
    )
})
// listen to fetch 
self.addEventListener('fetch', evt => {

    // Network Only
    if (evt.request.url === 'https://cmgt.hr.nl:8000/api/projects/tags') {
        fetch(evt.request)
        .catch(err => console.log(err))
    }
    // Network first
    else if (evt.request.url === 'https://cmgt.hr.nl:8000/api/projects/') {
        fetch(evt.request).then(fetchRes => {
            return fetchRes
        })
    } else {
        evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                // Images
                return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone())
                    return fetchRes
                })
            })
        })
    )
    }
})
