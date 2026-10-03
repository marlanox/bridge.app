// Network-first service worker — this build changes multiple times per hour while it's
// being tested, so a device must always see the latest deploy on the next load whenever
// it has a connection at all; the cache exists purely as an offline fallback, never as
// the default source. (An earlier cache-first version of this file, plus a CACHE_NAME
// that was never bumped across deploys, is why fixes kept not showing up on a real
// device even after being pushed — every load kept re-serving the same stale cache
// entry.) Bump CACHE_NAME on every deploy anyway, so an update is never silently missed
// even for a client that's briefly offline.
const CACHE_NAME = "bridge-pwa-v45";

const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./css/bridge.css",
  "./js/app.js",
  "./js/state.js",
  "./js/content.js",
  "./js/components.js",
  "./js/screens.js",
  "./js/sounds.js",
  "./js/voiceStore.js",
  "./content/strings.en.json",
  "./content/strings.ru.json",
  "./content/decks.json",
  "./content/rooms.json",
  "./content/flow.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

// Photos never change between deploys (a new one gets a new filename, not an edit in
// place) and are 200-450KB each — re-fetching the SAME one over the network on every
// single screen visit, which the network-first/no-store rule below used to do for
// these too, is exactly what made navigating between rooms feel slow. Warmed into the
// cache right after install (best-effort — see activate below), then served
// cache-first by the fetch handler forever after.
const ROOM_IMAGES = [
  "./assets/rooms/hall.jpg",
  "./assets/rooms/living-room.jpg",
  "./assets/rooms/study.jpg",
  "./assets/rooms/kids-room.jpg",
  "./assets/rooms/kitchen.jpg",
  "./assets/rooms/basement.jpg",
  "./assets/rooms/bridge.jpg",
  "./assets/rooms/house-exterior.jpg",
  "./assets/rooms/house-map.jpg",
  "./assets/rooms/oath.jpg",
  "./assets/rooms/ending.jpg",
  "./assets/rooms/end.jpg",
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
      // allSettled, not addAll: a single flaky image fetch must never block activation
      // (addAll is all-or-nothing) — every image gets its own best-effort attempt, and
      // the fetch handler below falls back to fetching it live if it's still missing.
      .then(() => caches.open(CACHE_NAME))
      .then((cache) => Promise.allSettled(ROOM_IMAGES.map((url) => cache.add(url))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isRoomImage = url.pathname.includes("/assets/rooms/");

  if (isRoomImage) {
    // Cache-first: these are static, content-addressed-in-practice photos, not code —
    // freshness was never the concern no-store exists for below, only for app code.
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    // `cache: "no-store"` forces an actual network round trip, bypassing the
    // *browser's own* HTTP cache (separate from the Cache Storage this worker
    // manages above) — GitHub Pages serves every file with a Cache-Control
    // max-age, and a plain `fetch()` is allowed to silently answer from that
    // HTTP cache without ever hitting the network at all. That defeats the
    // whole point of "network-first": the fix had already shipped, but the
    // phone kept quietly re-serving the exact bytes it fetched 10 minutes ago.
    fetch(event.request, { cache: "no-store" })
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
