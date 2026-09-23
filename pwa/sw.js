// Network-first service worker — this build changes multiple times per hour while it's
// being tested, so a device must always see the latest deploy on the next load whenever
// it has a connection at all; the cache exists purely as an offline fallback, never as
// the default source. (An earlier cache-first version of this file, plus a CACHE_NAME
// that was never bumped across deploys, is why fixes kept not showing up on a real
// device even after being pushed — every load kept re-serving the same stale cache
// entry.) Bump CACHE_NAME on every deploy anyway, so an update is never silently missed
// even for a client that's briefly offline.
const CACHE_NAME = "bridge-pwa-v15";

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
  "./js/sounds.js",
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
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      // Only touch the cache when the network is actually unreachable (offline, or no
      // connection at all) — never to save a round trip while a fresher copy exists.
      .catch(() => caches.match(event.request))
  );
});
