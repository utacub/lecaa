// LECAA: treballador de servei per instal·lar l'aplicació i fer-la servir sense connexió.
// La pàgina (lecaa-pwa.js) descarrega els recursos a la memòria cau RECURSOS; aquí només se serveixen.
const VERSIO = '__VERSIO__';
const NUCLI = 'lecaa-nucli-' + VERSIO;
const RECURSOS = 'lecaa-recursos';
const FITXERS_NUCLI = __NUCLI__;
const LLISTA_RECURSOS = __RECURSOS__;
const CLAUS_NUCLI = new Set(FITXERS_NUCLI.map(f => new URL(f, self.location).href));

self.addEventListener('install', e => {
  // 'reload': les còpies noves, no les de la memòria del navegador.
  e.waitUntil(caches.open(NUCLI).then(c => c.addAll(FITXERS_NUCLI.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('lecaa-nucli-') && k !== NUCLI) await caches.delete(k);
    const c = await caches.open(RECURSOS), vigents = new Set(LLISTA_RECURSOS.map(r => new URL(r, self.location).href));
    for (const req of await c.keys()) if (!vigents.has(req.url)) await c.delete(req);
    await self.clients.claim();
  })());
});

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

// Primer la xarxa, perquè les versions noves arribin; sense connexió, o si la xarxa no respon en 4 segons,
// la còpia desada.
function xarxaPrimer(req, clau) {
  const xarxa = fetch(req).then(resp => {
    if (resp.ok && resp.type === 'basic') { const copia = resp.clone(); caches.open(NUCLI).then(c => c.put(clau, copia)); }
    return resp;
  });
  const desada = () => caches.match(clau);
  return new Promise(resol => {
    let fet = false;
    const acaba = r => { if (!fet && r) { fet = true; resol(r); } };
    const temps = setTimeout(() => desada().then(acaba), 4000);
    xarxa.then(r => { clearTimeout(temps); acaba(r); },
      () => { clearTimeout(temps); desada().then(r => acaba(r || Response.error())); });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  // Les descàrregues de la pàgina van directament a la xarxa.
  if (url.searchParams.has('baixa')) return;
  const clau = url.origin + url.pathname;
  if (url.pathname.includes('/recursos/')) {
    e.respondWith((async () => {
      const c = await caches.open(RECURSOS);
      let resp = await c.match(clau);
      if (!resp) { resp = await fetch(clau); if (resp.ok) c.put(clau, resp.clone()); }
      return req.headers.has('range') ? respostaParcial(req, resp) : resp;
    })());
  } else if (req.mode === 'navigate') {
    const app = clau === new URL('./', self.location).href || clau === new URL('index.html', self.location).href;
    e.respondWith(app ? xarxaPrimer(req, new URL('index.html', self.location).href)
      : fetch(req).catch(() => caches.match(new URL('index.html', self.location).href)));
  } else if (CLAUS_NUCLI.has(clau)) {
    e.respondWith(xarxaPrimer(req, clau));
  } else {
    e.respondWith(fetch(req).catch(() => caches.match(clau).then(r => r || Response.error())));
  }
});
