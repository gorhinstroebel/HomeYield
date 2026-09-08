const CACHE_PREFIX = `homeyield-${self.registration.scope}-`;
const CACHE_NAME = `${CACHE_PREFIX}v21`;
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon.png", "./privacy.html", "./downloads.html", "./downloads.css", "./downloads.js"];
const SHELL_URLS = new Set(SHELL.map((path) => new URL(path, self.registration.scope).href));

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL.map((path) => new Request(path, { cache: "reload" })))));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name !== CACHE_NAME && (name.startsWith(CACHE_PREFIX) || /^homeyield-shell-v\d+$/.test(name))).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  url.search = "";
  if (event.request.method !== "GET" || !SHELL_URLS.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    let response;
    try {
      response = await fetch(event.request);
    } catch (error) {
      const cached = await cache.match(url.href);
      if (cached) return cached;
      console.warn("HomeYield offline asset unavailable.", url.pathname, error);
      return Response.error();
    }
    if (response.ok) await cache.put(url.href, response.clone());
    return response;
  })());
});
