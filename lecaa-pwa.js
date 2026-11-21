// LECAA: installation as an app (PWA) and use without a connection.
// The «Instal·lar» button of the home page opens a window that says how much space LECAA takes, asks the browser to
// install it where the page can (Chrome, Edge) and downloads every image, sound and video into the Cache Storage,
// with a warning and a progress bar. The download runs here, in the page, because the browser can stop a service
// worker after a few minutes. It retries failed files, can be stopped and resumed (files already kept are not
// downloaded again) and continues by itself when the connection comes back. The installed app completes the download
// when it opens: on the iPad and the iPhone it has its own storage, separate from Safari. sw.js serves the kept files.
// Visiting the web without installing downloads nothing extra. On file:// everything is off.
// The file is called lecaa-pwa.js, not pwa.js, so that the service worker of older versions (which served pwa.js from
// its cache) cannot pair the new page with the old script.
if ('serviceWorker' in navigator && 'caches' in window && window.isSecureContext && location.protocol !== 'file:') {
  const RECURSOS = 'lecaa-recursos', MARCA = 'lecaa-pwa', base = new URL('./', document.baseURI).href;
  const PAGINA = ['index.html', 'lecaa-pwa.js', 'manifest.webmanifest', 'pwa-fitxers.json'];
  const pwa = { llista: null, fet: 0, total: 0, falten: null, nucli: false, feina: null, aturat: false, error: '', espera: false, finestra: null, prompt: null, installed: false };
  const standalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: minimal-ui)').matches || navigator.standalone === true;
  const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const macSafari = !apple && /Macintosh/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Firefox/.test(navigator.userAgent);
  const marca = () => { try { return JSON.parse(localStorage.getItem(MARCA)) || {}; } catch { return {}; } };
  const desaMarca = value => { try { localStorage.setItem(MARCA, JSON.stringify({ ...marca(), ...value })); } catch {} };
  const complet = () => !!pwa.llista && pwa.falten?.length === 0 && pwa.nucli;
  const mida = bytes => { const mb = bytes / 1048576; return (mb < 10 ? Math.max(0.1, Math.round(mb * 10) / 10) : Math.round(mb)).toLocaleString('ca') + ' MB'; };
  const percent = () => pwa.total ? Math.min(100, Math.floor(pwa.fet * 100 / pwa.total)) : 0;
  const espera = ms => new Promise(ok => setTimeout(ok, ms));

  // ── What has to be kept, and what is kept already ──
  async function comprova() {
    const r = await fetch(base + 'pwa-fitxers.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('llista ' + r.status);
    pwa.llista = await r.json();
    const c = await caches.open(RECURSOS), tinc = new Set((await c.keys()).map(q => q.url));
    pwa.falten = pwa.llista.fitxers.filter(([p]) => !tinc.has(base + p));
    pwa.total = pwa.llista.nucli + pwa.llista.fitxers.reduce((s, f) => s + f[1], 0);
    pwa.fet = pwa.total - pwa.falten.reduce((s, f) => s + f[1], 0);
    // The page itself, kept by the service worker of this same version, which serves it without a connection.
    const reg = await navigator.serviceWorker.getRegistration(base).catch(() => null);
    const pagina = await Promise.all(PAGINA.map(p => caches.match(base + p)));
    pwa.nucli = !!reg?.active && pagina.every(Boolean);
    if (!pwa.nucli) pwa.fet -= pwa.llista.nucli;
    if (complet()) { pwa.error = ''; desaMarca({ complet: pwa.llista.versio }); }
    pinta();
  }
  // Waits until the newest service worker is active (it keeps the page when it installs).
  async function preparaSW() {
    let reg = await navigator.serviceWorker.getRegistration(base).catch(() => null);
    if (!reg) reg = await navigator.serviceWorker.register('sw.js', { scope: './' });
    else await reg.update().catch(() => {});
    const w = reg.installing || reg.waiting;
    if (w && w.state !== 'activated') await Promise.race([espera(60000), new Promise(ok => w.addEventListener('statechange', () => { if (w.state === 'activated' || w.state === 'redundant') ok(); }))]);
    else if (!reg.active) await Promise.race([navigator.serviceWorker.ready, espera(60000)]);
  }

  // ── The download ──
  let wakeLock = null;
  const desperta = async () => { try { if (pwa.feina && !wakeLock && document.visibilityState === 'visible') { wakeLock = await navigator.wakeLock?.request('screen'); wakeLock?.addEventListener('release', () => { wakeLock = null; }); } } catch {} };
  const dorm = () => { wakeLock?.release().catch(() => {}); wakeLock = null; };
  async function baixa(senyal) {
    const c = await caches.open(RECURSOS), cua = pwa.falten.slice(), tots = new AbortController();
    const aturaTots = () => tots.abort();
    senyal.addEventListener('abort', aturaTots);
    let pintat = 0;
    const avanca = n => { pwa.fet += n; if (Date.now() - pintat > 250) { pintat = Date.now(); pinta(); } };
    async function un([p, size]) {
      for (let intent = 0; ; intent++) {
        if (tots.signal.aborted) throw new DOMException('Aturat', 'AbortError');
        const ctrl = new AbortController(), atura = () => ctrl.abort();
        // A file is given up only when no data arrives for 30 seconds, so slow connections still work.
        let temps = setTimeout(atura, 30000), rebut = 0;
        tots.signal.addEventListener('abort', atura);
        try {
          const r = await fetch(base + p + '?baixa=1', { cache: 'no-cache', signal: ctrl.signal });
          if (!r.ok) throw new Error(p + ' ' + r.status);
          const parts = [], reader = r.body?.getReader?.();
          if (reader) for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            clearTimeout(temps); temps = setTimeout(atura, 30000);
            parts.push(value); rebut += value.byteLength; avanca(value.byteLength);
          } else { const buf = await r.arrayBuffer(); parts.push(buf); rebut = buf.byteLength; avanca(rebut); }
          if (rebut !== size) throw new Error(p + ' mida ' + rebut);
          await c.put(base + p, new Response(new Blob(parts), { headers: { 'Content-Type': r.headers.get('content-type') || 'application/octet-stream', 'Content-Length': String(size) } }));
          return;
        } catch (e) {
          avanca(-rebut);
          if (tots.signal.aborted || e.name === 'QuotaExceededError' || intent >= 3) throw e;
          await espera(1500 * (intent + 1));
        } finally { clearTimeout(temps); tots.signal.removeEventListener('abort', atura); }
      }
    }
    const fil = async () => { while (cua.length && !tots.signal.aborted) await un(cua.shift()); };
    try {
      // Five files at a time; one that keeps failing stops the others.
      await Promise.all(Array.from({ length: 5 }, () => fil().catch(e => { tots.abort(); throw e; })));
    } finally { senyal.removeEventListener('abort', aturaTots); pinta(); }
    if (senyal.aborted) throw new DOMException('Aturat', 'AbortError');
  }
  // Only one window of LECAA downloads at a time; the others wait and then find everything kept.
  const ambClau = (senyal, fn) => navigator.locks?.request ? navigator.locks.request('lecaa-baixada', { signal: senyal }, fn) : fn();
  function descarrega() {
    if (pwa.feina) return pwa.feina.promesa;
    const ctrl = new AbortController();
    pwa.feina = { ctrl }; pwa.error = ''; pwa.aturat = false; desaMarca({ instal: true });
    navigator.storage?.persist?.().catch(() => {});
    desperta(); pinta();
    pwa.feina.promesa = (async () => {
      const avisa = setTimeout(() => { pwa.espera = true; pinta(); }, 1500);
      try {
        if (!navigator.onLine) throw new Error('offline');
        await ambClau(ctrl.signal, async () => {
          clearTimeout(avisa); pwa.espera = false;
          await comprova();
          if (pwa.falten.length) await baixa(ctrl.signal);
          if (!pwa.nucli) { await preparaSW(); await comprova(); }
          if (!complet()) throw new Error('incomplet');
        });
      } catch (e) {
        if (e.name !== 'AbortError') pwa.error = e.name === 'QuotaExceededError' ? 'espai' : navigator.onLine ? 'error' : 'connexio';
        await comprova().catch(() => {});
      } finally {
        clearTimeout(avisa); pwa.espera = false; pwa.feina = null; dorm(); pinta();
      }
    })();
    return pwa.feina.promesa;
  }
  // Continue by itself when it was started here (or this is the installed app) and something is missing,
  // unless the adult stopped it in this visit.
  const continua = () => {
    if (pwa.feina || pwa.aturat || !navigator.onLine || !pwa.llista || complet()) return;
    if (standalone() || marca().instal) descarrega();
  };
  window.addEventListener('online', continua);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { desperta(); continua(); } });

  // ── Texts ──
  const missatgeError = () => ({
    espai: 'No hi ha prou espai lliure en aquest dispositiu per acabar la descàrrega.',
    connexio: 'S’ha perdut la connexió. Quan torni a haver-n’hi, la descàrrega continuarà sola on s’havia quedat.',
    error: 'No s’ha pogut descarregar tot. Torna-ho a provar: continuarà on s’havia quedat.'
  })[pwa.error] || '';
  const estatPeu = () => {
    if (pwa.feina) return 'Descarregant LECAA per fer-la servir sense connexió: ' + percent() + ' % (' + mida(pwa.fet) + ' de ' + mida(pwa.total) + ').';
    if (complet()) return 'Disponible sense connexió.';
    if (!pwa.llista) return '';
    if (pwa.error) return missatgeError();
    if (standalone() || marca().instal) return 'Falten ' + mida(pwa.total - pwa.fet) + ' per poder fer servir LECAA sense connexió.' + (navigator.onLine ? '' : ' Connecta’t a Internet per acabar la descàrrega.');
    return 'Per fer servir LECAA sense connexió, instal·la-la amb el botó «Instal·lar» de la pàgina inicial.';
  };

  // ── Adult footer and home page button ──
  function pintaPeu() {
    for (const footer of document.querySelectorAll('.page-footer')) {
      let box = footer.querySelector('[data-pwa-status]');
      if (!box) {
        box = document.createElement('p'); box.className = 'pwa-status';
        box.dataset.pwaStatus = ''; box.setAttribute('role', 'status'); footer.append(box);
      }
      const text = estatPeu(), boto = !pwa.feina && !complet() && !!pwa.llista && navigator.onLine && !!(pwa.error || standalone() || marca().instal);
      if (box.dataset.message === text && !!box.querySelector('button') === boto) continue;
      box.dataset.message = text; box.textContent = text;
      if (boto) {
        const button = document.createElement('button'); button.type = 'button';
        button.textContent = pwa.error ? 'Torna-ho a provar' : 'Continua la descàrrega';
        button.onclick = () => { descarrega(); obre(); }; box.append(button);
      }
    }
  }
  function pintaBoto() {
    const nav = document.querySelector('.home-info-actions'); if (!nav) return;
    let button = nav.querySelector('[data-home-install]');
    if ((standalone() || pwa.installed) && complet() && !pwa.feina) { button?.remove(); return; }
    if (!button) {
      button = document.createElement('button'); button.type = 'button'; button.className = 'btn ghost small';
      button.dataset.homeInstall = ''; button.onclick = obre; nav.append(button);
    }
    const text = pwa.feina ? 'Descarregant… ' + percent() + ' %' : standalone() && pwa.llista && !complet() ? 'Completa la instal·lació' : 'Instal·lar';
    if (button.textContent !== text) button.textContent = text;
  }

  // ── The window ──
  const el = (tag, props = {}, ...fills) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v);
    e.append(...fills.filter(Boolean)); return e;
  };
  const boto = (text, fn, principal) => { const b = el('button', { type: 'button', class: principal ? 'btn' : 'btn ghost' }, text); b.onclick = fn; return b; };
  const parts = () => {
    const p = { Imatges: 0, 'Sons i veus': 0, 'Vídeos': 0, 'Programa i lletres': pwa.llista.nucli };
    for (const [path, size] of pwa.llista.fitxers) {
      const ext = path.slice(path.lastIndexOf('.') + 1);
      p[ext === 'mp4' ? 'Vídeos' : ['mp3', 'wav'].includes(ext) ? 'Sons i veus' : ['webp', 'png', 'svg', 'jpg'].includes(ext) ? 'Imatges' : 'Programa i lletres'] += size;
    }
    return el('ul', { class: 'pwa-parts' }, ...Object.entries(p).filter(x => x[1]).map(([n, b]) => el('li', {}, el('span', { text: n }), el('strong', { text: mida(b) }))));
  };
  const passosApple = () => el('ol', {}, ...(apple
    ? ['Toca el botó Comparteix del navegador (el quadrat amb una fletxa cap amunt).', 'Tria «Afegeix a la pantalla d’inici» i després «Afegeix».', 'Obre LECAA des de la pantalla d’inici amb connexió a Internet. S’hi descarregaran totes les imatges, els sons i els vídeos (' + mida(pwa.total) + '). Deixa-la oberta fins que digui que ja funciona sense connexió.']
    : ['Al menú Arxiu de Safari, tria «Afegeix al Dock».', 'Obre LECAA des del Dock amb connexió a Internet. S’hi descarregaran totes les imatges, els sons i els vídeos (' + mida(pwa.total) + '). Deixa-la oberta fins que digui que ja funciona sense connexió.']
  ).map(t => el('li', { text: t })));
  let quota = null;
  function contingut() {
    if (!pwa.llista) return [el('p', { text: navigator.onLine ? 'Calculant l’espai que ocupa…' : 'Cal connexió a Internet per instal·lar LECAA.' })];
    if (pwa.feina) {
      const barra = el('div', { class: 'pwa-barra', role: 'progressbar', 'aria-label': 'Descàrrega de LECAA', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(percent()) }, el('span'));
      barra.firstChild.style.width = percent() + '%';
      return [
        el('p', { class: 'pwa-avis', role: 'alert', tabindex: '-1', text: pwa.espera ? 'LECAA s’està descarregant en una altra finestra. Deixa-la oberta fins que acabi.' : 'S’estan descarregant les imatges, els sons i els vídeos de LECAA. No tanquis LECAA ni desconnectis el dispositiu d’Internet fins que acabi.' }),
        barra,
        el('p', { class: 'pwa-xifres' }, el('span', { text: mida(pwa.fet) + ' de ' + mida(pwa.total) }), el('strong', { text: percent() + ' %' })),
        el('p', { class: 'muted', text: 'Si s’atura, la propera vegada continuarà on s’ha quedat.' }),
        el('div', { class: 'row' }, boto('Atura la descàrrega', () => { pwa.aturat = true; pwa.feina?.ctrl.abort(); }))
      ];
    }
    const cos = [];
    if (complet()) {
      const app = standalone() || pwa.installed;
      cos.push(el('p', { class: 'pwa-ok', text: app ? 'LECAA està instal·lada en aquest dispositiu i funciona sense connexió.' : 'Totes les imatges, els sons i els vídeos ja són en aquest dispositiu: LECAA funciona sense connexió en aquest navegador.' }));
      if (!app && (apple || macSafari)) cos.push(el('p', { text: 'Per tenir-la com a aplicació:' }), passosApple());
      else if (!app) cos.push(el('p', { class: 'muted', text: 'Per tenir-la com a aplicació, fes servir la icona d’instal·lar de la barra d’adreces o el menú del navegador.' }));
      cos.push(el('p', { class: 'pwa-total' }, el('span', { text: 'Espai que ocupa' }), el('strong', { text: mida(pwa.total) })), el('div', { class: 'row' }, boto('D’acord', tanca, true)));
      return cos;
    }
    if (pwa.error) cos.push(el('p', { class: 'pwa-error', role: 'alert', text: missatgeError() }));
    if ((apple || macSafari) && !standalone()) {
      cos.push(el('p', { text: (apple ? 'A l’iPad i l’iPhone' : 'A Safari') + ', LECAA s’instal·la així:' }), passosApple());
      if (apple) cos.push(el('p', { class: 'muted', text: 'L’aplicació instal·lada desa els perfils a part de Safari. Per fer-hi servir els perfils que ja tens, desa una còpia de seguretat aquí i importa-la a l’aplicació.' }));
      cos.push(el('div', { class: 'row' }, boto('D’acord', tanca, true)));
      return cos;
    }
    const falta = pwa.total - pwa.fet, lliure = quota?.quota ? quota.quota - quota.usage : null;
    cos.push(el('p', { text: standalone()
      ? 'Per fer servir LECAA sense connexió, cal descarregar-ne totes les imatges, els sons i els vídeos en aquest dispositiu.'
      : 'LECAA s’instal·larà en aquest dispositiu com una aplicació i s’hi descarregaran totes les imatges, els sons i els vídeos perquè funcioni sense connexió.' }));
    const represa = pwa.fet - pwa.llista.nucli > pwa.total / 50;
    cos.push(el('p', { class: 'pwa-total' }, el('span', { text: represa ? 'Falta descarregar' : 'Espai que ocuparà' }), el('strong', { text: mida(represa ? falta : pwa.total) })), parts());
    if (lliure !== null && lliure < falta) cos.push(el('p', { class: 'pwa-error', text: 'Potser no hi ha prou espai lliure en aquest dispositiu.' }));
    cos.push(el('p', { class: 'muted', text: navigator.onLine ? 'La descàrrega pot trigar uns minuts. Mentrestant, deixa LECAA oberta i el dispositiu connectat a Internet.' : 'Ara no hi ha connexió. Connecta el dispositiu a Internet per descarregar-ho.' }));
    if (represa) cos.push(el('p', { class: 'muted', text: 'Ja se n’ha descarregat el ' + percent() + ' %. El que ja hi ha no es tornarà a descarregar.' }));
    const va = boto((standalone() || !pwa.prompt ? 'Descarrega' : 'Instal·la') + ' (' + mida(falta) + ')', installa, true);
    va.disabled = !navigator.onLine;
    cos.push(el('div', { class: 'row' }, va, boto('Ara no', tanca)));
    return cos;
  }
  function pintaFinestra() {
    const f = pwa.finestra; if (!f) return;
    if (!f.ov.isConnected) { pwa.finestra = null; return; }
    const cos = contingut(), clau = cos.map(e => e.outerHTML).join('');
    if (f.clau === clau) return;
    const barra = f.body.querySelector('.pwa-barra'), avis = f.body.querySelector('.pwa-avis');
    // While downloading only the numbers change: keep the nodes, so focus and screen readers are not disturbed.
    if (pwa.feina && barra && avis?.textContent === cos[0].textContent) {
      barra.firstChild.style.width = percent() + '%'; barra.setAttribute('aria-valuenow', String(percent()));
      f.body.querySelector('.pwa-xifres').replaceWith(cos[2]); f.clau = clau; return;
    }
    const enfocat = f.body.contains(document.activeElement) || document.activeElement === document.body;
    f.body.replaceChildren(...cos); f.clau = clau;
    // When the download starts, focus goes to the warning, not to «Atura la descàrrega», so a second press stops nothing.
    if (enfocat) (f.body.querySelector('.pwa-avis') || f.body.querySelector('.btn:not(.ghost):not(:disabled)') || f.body.querySelector('button:not(:disabled)') || f.closeButton)?.focus();
  }
  function tanca() { pwa.finestra?.close(); pwa.finestra = null; }
  function obre() {
    if (pwa.finestra?.ov.isConnected || typeof localDialog !== 'function') return;
    const d = localDialog('Instal·lar LECAA', 'install-dialog pwa-dialog', () => { pwa.finestra = null; });
    pwa.finestra = { ov: d.ov, body: d.body, close: d.close, closeButton: d.ov.querySelector('.local-dialog-heading button'), clau: '' };
    pintaFinestra();
    navigator.storage?.estimate?.().then(e => { quota = e; pintaFinestra(); }).catch(() => {});
    if (!pwa.llista) comprova().catch(() => pinta());
  }
  async function installa() {
    if (pwa.prompt && !standalone()) {
      const prompt = pwa.prompt; pwa.prompt = null; prompt.prompt();
      const choice = await prompt.userChoice.catch(() => null);
      if (choice?.outcome === 'accepted') pwa.installed = true;
      else if (choice) { pwa.finestra && (pwa.finestra.clau = ''); pinta(); return; }
    }
    descarrega();
  }
  function pinta() { pintaPeu(); pintaBoto(); pintaFinestra(); }

  // ── Styles for the window ──
  const style = document.createElement('style');
  style.textContent = `.pwa-dialog{width:min(620px,100%)!important}
.pwa-dialog .local-dialog-body{display:grid;gap:14px}
.pwa-dialog .pwa-avis{padding:12px 14px;border-radius:12px;background:#fff4dc;border:1px solid #e3b65c;color:#5a3d00;font-weight:650}
.pwa-dialog .pwa-avis:focus{outline:3px solid #17676b;outline-offset:2px}
.pwa-dialog .pwa-barra{height:16px;border-radius:8px;background:#e1ece8;overflow:hidden}
.pwa-dialog .pwa-barra span{display:block;height:100%;width:0;background:#17676b;transition:width .3s}
.pwa-dialog .pwa-xifres,.pwa-dialog .pwa-total{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-weight:650}
.pwa-dialog .pwa-total{padding:14px 16px;border:1px solid #bfd1c8;border-radius:14px;background:#fff}
.pwa-dialog .pwa-total strong{font-size:1.6rem;letter-spacing:-.02em}
.pwa-dialog .pwa-parts{list-style:none;margin:0;padding:0 16px;display:grid;gap:4px;font-size:.92rem}
.pwa-dialog .pwa-parts li{display:flex;justify-content:space-between;gap:12px}
.pwa-dialog .pwa-error{color:#a3261e;font-weight:650}.pwa-dialog .pwa-ok{font-weight:650}
.pwa-dialog ol{margin:0;padding-left:1.3em;display:grid;gap:6px;line-height:1.55}
@media (prefers-reduced-motion:reduce){.pwa-dialog .pwa-barra span{transition:none}}`;
  document.head.append(style);

  // ── Start ──
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); pwa.prompt = event; pintaFinestra(); });
  window.addEventListener('appinstalled', () => { pwa.prompt = null; pwa.installed = true; desaMarca({ instal: true }); pinta(); });
  // A new service worker keeps the page of the new version when it becomes active.
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!pwa.feina) comprova().then(continua, () => {}); });
  new MutationObserver(() => { pintaPeu(); pintaBoto(); }).observe(document.getElementById('app'), { childList: true, subtree: true });
  pinta();
  navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {})
    .then(() => comprova()).catch(() => { pinta(); })
    .then(async () => {
      if (!pwa.llista || complet()) return;
      // After an update everything may already be kept except the page of the new version, which its service worker
      // keeps when it installs: wait for it before saying anything is missing.
      if (!pwa.falten.length) { await preparaSW().catch(() => {}); await comprova().catch(() => {}); if (complet()) return; }
      // The installed app opens the window the first time, until everything is kept; later versions download quietly.
      if (standalone() && marca().complet == null) { obre(); if (navigator.onLine) descarrega(); }
      else continua();
    });
}
