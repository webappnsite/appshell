const cacheName = "as-v1"
const resources = [
    "/404.html",
    "/412.html",
    "/style.css"
]

self.oninstall = (event) => {
    event.waitUntil(
        caches.open(cacheName)
        .then((cache) => {}/* cache.addAll(resources) */)
        .catch(console.error)
    )

    self.skipWaiting()
}

self.onactivate = (event) => {
    event.waitUntil(
        caches.keys()
        .then((keys) => Promise.all(
            keys
            .filter((key) => key != cacheName)
            .map((key) => caches.delete(key))
        ))
        .catch(console.error)
    )

    self.clients.claim()
}

self.onfetch = (event) => {
    const request = event.request
    const requestURL = new URL(request.url)

    if (request.method == "GET"
    && self.location.origin == requestURL.origin) {
        event.respondWith(
            caches.open(cacheName)
            .then((cache) => {
                return fetch(request)
                .then((fresponse) => {
                    // cache.put(request, fresponse.clone())
                    return fresponse
                })
                .catch(() => {
                    return cache.match(request)
                    .then((cresponse) => cresponse || caches.match(resources[1]))
                })
            })
        )
    }
}
