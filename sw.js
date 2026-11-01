const VERSION = "menologio-5f175b07bc";
const BIBLE = "bibbia-v1";
const FILES = [
 "./",
 "bible/PSA.json",
 "bible/index.json",
 "data/akathist.json",
 "data/calendar.json",
 "data/texts-cu.json",
 "data/texts-it.json",
 "data/texts-ru.json",
 "fonts.css",
 "fonts/old-standard-tt-cyrillic-400-italic.woff2",
 "fonts/old-standard-tt-cyrillic-400-normal.woff2",
 "fonts/old-standard-tt-cyrillic-700-normal.woff2",
 "fonts/old-standard-tt-cyrillic-ext-400-italic.woff2",
 "fonts/old-standard-tt-cyrillic-ext-400-normal.woff2",
 "fonts/old-standard-tt-cyrillic-ext-700-normal.woff2",
 "fonts/old-standard-tt-latin-400-italic.woff2",
 "fonts/old-standard-tt-latin-400-normal.woff2",
 "fonts/old-standard-tt-latin-700-normal.woff2",
 "fonts/old-standard-tt-latin-ext-400-italic.woff2",
 "fonts/old-standard-tt-latin-ext-400-normal.woff2",
 "fonts/old-standard-tt-latin-ext-700-normal.woff2",
 "fonts/spectral-cyrillic-400-italic.woff2",
 "fonts/spectral-cyrillic-400-normal.woff2",
 "fonts/spectral-cyrillic-600-normal.woff2",
 "fonts/spectral-cyrillic-ext-400-italic.woff2",
 "fonts/spectral-cyrillic-ext-400-normal.woff2",
 "fonts/spectral-cyrillic-ext-600-normal.woff2",
 "fonts/spectral-latin-400-italic.woff2",
 "fonts/spectral-latin-400-normal.woff2",
 "fonts/spectral-latin-600-normal.woff2",
 "fonts/spectral-latin-ext-400-italic.woff2",
 "fonts/spectral-latin-ext-400-normal.woff2",
 "fonts/spectral-latin-ext-600-normal.woff2",
 "fonts/spectral-sc-cyrillic-500-normal.woff2",
 "fonts/spectral-sc-cyrillic-ext-500-normal.woff2",
 "fonts/spectral-sc-latin-500-normal.woff2",
 "fonts/spectral-sc-latin-ext-500-normal.woff2",
 "icons/apple-touch-icon.png",
 "icons/favicon-64.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "index.html",
 "lampada.html",
 "manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => (k.startsWith("menologio-") && k !== VERSION) || (k.startsWith("bibbia-") && k !== BIBLE)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(/\/bible\/[^/]+\.json$/.test(new URL(req.url).pathname) ? BIBLE : VERSION).then(cache => cache.put(req, copy)); }
      return res;
    }).catch(() => req.mode === "navigate" ? caches.match("index.html") : Response.error()))
  );
});
