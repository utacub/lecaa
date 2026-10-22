// Registra el treballador de servei i hi demana que desi tots els recursos per a l'ús sense connexió.
if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js', { scope: './' }).then(() => navigator.serviceWorker.ready)
    .then(reg => reg.active && reg.active.postMessage('precarrega')).catch(() => {});
}
