const CACHE_NAME = "tumbuah-mobile-v2";
// Resolve the project path at runtime so GitHub Pages works for /tumbuah/ or other repo names.
const BASE = new URL("./", self.location.href).pathname;
const APP_SHELL = [
  BASE,
  BASE + "index.html",
  BASE + "trace.html",
  BASE + "styles.css",
  BASE + "manifest.json",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png",
  BASE + "icons/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => (key.startsWith("kamus-rejang-") || key.startsWith("tumbuah-")) && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Optional Rejang web font: cache it after the first successful online load.
  // The application shell remains usable if the font is unavailable offline.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === "opaque")) {
          try { await cache.put(request, response.clone()); } catch (_) {}
        }
        return response;
      } catch (_) {
        return cached || Response.error();
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  const isAppNavigation = request.mode === "navigate" && url.pathname.startsWith(BASE);
  if (isAppNavigation) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          await cache.put(request, response.clone());
          if (url.pathname === BASE || url.pathname === BASE + "index.html") {
            await cache.put(BASE, response.clone());
            await cache.put(BASE + "index.html", response.clone());
          }
        }
        return response;
      } catch (_) {
        return (await cache.match(request)) ||
          (await cache.match(BASE)) ||
          (await cache.match(BASE + "index.html")) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const saved = await cache.match(request);
    if (saved) return saved;
    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === "opaque")) {
        try { await cache.put(request, response.clone()); } catch (_) {}
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
