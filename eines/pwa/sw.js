// LECAA: treballador de servei per instal·lar l'aplicació i fer-la servir sense connexió.
const VERSIO = '__VERSIO__';
const NUCLI = 'lecaa-nucli-' + VERSIO;
const RECURSOS = 'lecaa-recursos';
const FITXERS_NUCLI = ['./', 'index.html', 'manifest.webmanifest', 'pwa.js', 'icones/icona-192.png', 'icones/icona-512.png', 'icones/icona-maskable-512.png'];
const LLISTA_RECURSOS = __RECURSOS__;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(NUCLI).then(c => c.addAll(FITXERS_NUCLI)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('lecaa-nucli-') && k !== NUCLI) await caches.delete(k);
    const c = await caches.open(RECURSOS), vigents = new Set(LLISTA_RECURSOS.map(r => new URL(r, self.registration.scope).href));
    for (const req of await c.keys()) if (!vigents.has(req.url)) await c.delete(req);
    await self.clients.claim();
  })());
});

// Desa en segon pla tots els recursos que encara no són a la memòria cau.
async function precarrega() {
  const c = await caches.open(RECURSOS);
  for (const r of LLISTA_RECURSOS) {
    if (await c.match(r)) continue;
    try { const resp = await fetch(r); if (resp.ok) await c.put(r, resp); } catch (err) { return; }
  }
}
self.addEventListener('message', e => { if (e.data === 'precarrega') e.waitUntil(precarrega()); });

// Les etiquetes d'àudio i vídeo demanen trossos del fitxer (capçalera Range).
async function respostaParcial(req, resp) {
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m) return resp;
  const dades = await resp.arrayBuffer(), mida = dades.byteLength;
  const inici = m[1] ? Number(m[1]) : Math.max(0, mida - Number(m[2]));
  const fi = m[1] && m[2] ? Math.min(Number(m[2]), mida - 1) : mida - 1;
  return new Response(dades.slice(inici, fi + 1), { status: 206, headers: {
    'Content-Type': resp.headers.get('Content-Type') || '', 'Content-Range': `bytes ${inici}-${fi}/${mida}`,
    'Content-Length': String(fi - inici + 1), 'Accept-Ranges': 'bytes' } });
}

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.includes('/recursos/')) {
    e.respondWith((async () => {
      const c = await caches.open(RECURSOS), clau = url.origin + url.pathname;
      let resp = await c.match(clau);
      if (!resp) { resp = await fetch(clau); if (resp.ok) c.put(clau, resp.clone()); }
      return req.headers.has('range') ? respostaParcial(req, resp) : resp;
    })());
  } else if (req.mode === 'navigate') {
    // Primer la xarxa, perquè les versions noves arribin; sense connexió, la còpia desada.
    e.respondWith(fetch(req).then(resp => { const copia = resp.clone(); caches.open(NUCLI).then(c => c.put('index.html', copia)); return resp; })
      .catch(() => caches.match('index.html', { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
  }
});
