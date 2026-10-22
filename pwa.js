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
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type !== 'lecaa-offline-status') return; status = event.data; render();
  });
  navigator.serviceWorker.addEventListener('controllerchange', prepare);
  window.addEventListener('online', () => { if (status.state !== 'ready') prepare(); });
  new MutationObserver(render).observe(document.getElementById('app'), { childList: true, subtree: true });
  render();
  prepare();
}
