// Service Worker: hält die App offline verfügbar und liefert lokal gespeicherte Dateien (Pläne, Fotos) aus.
const CACHE = 'begehung-176f8db86d';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'config.js', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'lib/pdf.min.mjs', 'lib/pdf.worker.min.mjs', 'lib/pdf-lib.min.js', 'lib/docx.iife.js', 'lib/jszip.min.js'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(SHELL.map((u) => c.add(new Request(u, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k.startsWith('begehung-')) await caches.delete(k);
    await self.clients.claim();
  })());
});

function openDb() {
  return new Promise((res) => {
    const r = indexedDB.open('begehung-app', 2);
    r.onupgradeneeded = () => {
      const d = r.result;
      if (!d.objectStoreNames.contains('pending')) d.createObjectStore('pending', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('files')) d.createObjectStore('files');
      if (!d.objectStoreNames.contains('docs')) d.createObjectStore('docs', { keyPath: 'path' });
      if (!d.objectStoreNames.contains('blobs')) d.createObjectStore('blobs', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta');
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => res(null);
    r.onblocked = () => res(null);
  });
}
async function getBlob(id) {
  const db = await openDb();
  if (!db) return null;
  return new Promise((res) => {
    try {
      const q = db.transaction('blobs', 'readonly').objectStore('blobs').get(id);
      q.onsuccess = () => { res(q.result || null); db.close(); };
      q.onerror = () => { res(null); db.close(); };
    } catch { res(null); db.close(); }
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || req.method !== 'GET') return;
  const scope = new URL(self.registration.scope).pathname;
  const rel = url.pathname.startsWith(scope) ? url.pathname.slice(scope.length) : url.pathname;
  if (rel.startsWith('_blob/')) {
    e.respondWith((async () => {
      const rec = await getBlob(decodeURIComponent(rel.slice(6)));
      if (!rec || !rec.blob) return new Response('nicht gefunden', { status: 404 });
      return new Response(rec.blob, { headers: { 'Content-Type': rec.type || rec.blob.type || 'application/octet-stream', 'Cache-Control': 'no-store' } });
    })());
    return;
  }
  const fresh = req.mode === 'navigate' || rel === '' || rel === 'index.html' || rel === 'config.js' || rel === 'manifest.webmanifest';
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    if (fresh) {
      try {
        const r = await fetch(req, { cache: 'no-cache' });
        if (r.ok) c.put(req.mode === 'navigate' ? 'index.html' : req, r.clone());
        return r;
      } catch {
        return (await c.match(req.mode === 'navigate' ? 'index.html' : req, { ignoreSearch: true })) || (await c.match('index.html')) || new Response('offline', { status: 503 });
      }
    }
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const r = await fetch(req);
    if (r.ok) c.put(req, r.clone());
    return r;
  })());
});
