// Offline readiness belongs in the adult footer, outside the learner's task.
if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
  let status = { state: 'preparing', done: 0, total: 0 }, registration, connecting;
  const message = () => status.state === 'ready' ? 'Disponible sense connexió.'
    : status.state === 'error' ? 'La descàrrega no s’ha completat. Connecta’t a Internet i torna-ho a provar.'
    : 'Preparant l’ús sense connexió' + (status.total ? ': ' + status.done + ' de ' + status.total + ' recursos (' + Math.floor(status.done * 100 / status.total) + '%).' : '…');
  const prepare = () => {
    if (registration?.active) { registration.active.postMessage('precarrega'); return; }
    if (connecting) return connecting;
    connecting = navigator.serviceWorker.register('sw.js', { scope: './' }).then(() => navigator.serviceWorker.ready)
      .then(reg => { registration = reg; if (reg.active) reg.active.postMessage('precarrega'); })
      .catch(() => { status = { ...status, state: 'error' }; render(); })
      .finally(() => { connecting = null; });
    return connecting;
  };
  const render = () => {
    for (const footer of document.querySelectorAll('.page-footer')) {
      let box = footer.querySelector('[data-pwa-status]');
      if (!box) {
        box = document.createElement('p'); box.className = 'pwa-status';
        box.dataset.pwaStatus = ''; box.setAttribute('role', 'status'); footer.append(box);
      }
      const text = message(), retry = status.state === 'error';
      if (box.dataset.message === text && !!box.querySelector('button') === retry) continue;
      box.dataset.message = text; box.textContent = text;
      if (retry) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Torna-ho a provar';
        button.onclick = () => { status = { ...status, state: 'preparing' }; render(); prepare(); }; box.append(button);
      }
    }
  };
  // «Instal·lar» on the home page, after «Què és LECAA», «Guia i Marc Teòric» and «Crèdits».
  let installPrompt = null, installed = false;
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const macSafari = !apple && /Macintosh/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Firefox/.test(navigator.userAgent);
  const showInstructions = () => {
    const steps = apple
      ? ['Toca el botó Comparteix del navegador (el quadrat amb una fletxa cap amunt).', 'Tria «Afegeix a la pantalla d’inici» i després «Afegeix».']
      : macSafari ? ['Al menú Arxiu de Safari, tria «Afegeix al Dock».']
      : ['Obre el menú del navegador i tria l’opció d’instal·lar LECAA o d’afegir-la a la pantalla d’inici.',
         'Si no hi apareix, potser ja està instal·lada o aquest navegador no permet instal·lar aplicacions. Chrome, Edge i Safari ho permeten.'];
    const notes = ['Un cop instal·lada, LECAA s’obre com una aplicació i funciona sense connexió.'];
    if (apple) notes.push('A l’iPad i l’iPhone, l’aplicació instal·lada desa els perfils a part de Safari. Per fer-hi servir els perfils que ja tens, desa una còpia de seguretat aquí i importa-la a l’aplicació.');
    if (typeof localDialog !== 'function') { alert(steps.concat(notes).join('\n')); return; }
    const { body } = localDialog('Instal·lar LECAA', 'install-dialog');
    const list = document.createElement('ol');
    for (const step of steps) { const item = document.createElement('li'); item.textContent = step; list.append(item); }
    body.append(list);
    for (const note of notes) { const paragraph = document.createElement('p'); paragraph.textContent = note; body.append(paragraph); }
  };
  const renderInstall = () => {
    const nav = document.querySelector('.home-info-actions'); if (!nav) return;
    let button = nav.querySelector('[data-home-install]');
    if (installed || standalone()) { button?.remove(); return; }
    if (button) return;
    button = document.createElement('button'); button.type = 'button'; button.className = 'btn ghost small';
    button.dataset.homeInstall = ''; button.textContent = 'Instal·lar';
    button.onclick = async () => {
      if (!installPrompt) { showInstructions(); return; }
      const prompt = installPrompt; installPrompt = null; prompt.prompt();
      const choice = await prompt.userChoice.catch(() => null);
      if (choice?.outcome === 'accepted') { installed = true; renderInstall(); }
    };
    nav.append(button);
  };
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
  window.addEventListener('appinstalled', () => { installPrompt = null; installed = true; renderInstall(); });
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type !== 'lecaa-offline-status') return; status = event.data; render();
  });
  navigator.serviceWorker.addEventListener('controllerchange', prepare);
  window.addEventListener('online', () => { if (status.state !== 'ready') prepare(); });
  new MutationObserver(() => { render(); renderInstall(); }).observe(document.getElementById('app'), { childList: true, subtree: true });
  render(); renderInstall();
  prepare();
}
