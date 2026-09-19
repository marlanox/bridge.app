// Cache-first service worker — Bridge should open instantly from the Home Screen even
// with a poor or no connection once it's been opened at least once. Bump CACHE_NAME
// whenever a deployed file changes so clients pick up the new version instead of a
// stale cached copy.
const CACHE_NAME = "bridge-pwa-v1";

const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/app.js",
  "./js/state.js",
  "./js/content.js",
  "./js/components.js",
  "./js/screens.js",
  "./content/strings.en.json",
  "./content/strings.ru.json",
  "./content/decks.json",
  "./content/rooms.json",
  "./content/flow.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      // Cache-first for anything we already have (instant, works offline); otherwise
      // fall through to the network.
      return cached || network;
    })
  );
});
