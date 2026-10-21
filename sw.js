// 서비스워커 — 설치 때 전부 캐시해 두고, 이후엔 캐시 먼저(오프라인 동작)
const C = "hyegi-0050eeaafa";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request)
    .then(res => { const cl = res.clone(); caches.open(C).then(c => c.put(e.request, cl)); return res; })
    .catch(() => caches.match("./index.html"))));
});
