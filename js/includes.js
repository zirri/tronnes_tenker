function showErrorBanner(message) {
  const div = document.createElement('div');
  div.textContent = message;
  div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#b00020;color:#fff;padding:.5rem 1rem;z-index:99999;font-size:.85rem;font-family:sans-serif;white-space:pre-wrap';
  document.body.appendChild(div);
}

window.addEventListener('error', e => {
  showErrorBanner(`JS-feil: ${e.message} (${e.filename || ''}:${e.lineno || ''})`);
});
window.addEventListener('unhandledrejection', e => {
  showErrorBanner(`Uventet feil: ${e.reason && e.reason.message ? e.reason.message : e.reason}`);
});

async function inject(selector, url) {
  const slot = document.querySelector(selector);
  if (!slot) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    slot.outerHTML = await res.text();
  } catch (err) {
    showErrorBanner(`Kunne ikke laste ${url}: ${err.message}`);
    slot.outerHTML = '';
  }
}

(async () => {
  await Promise.all([
    inject('[data-include="header"]', '/partials/header.html'),
    inject('[data-include="sidebar"]', '/partials/sidebar.html'),
    inject('[data-include="footer"]', '/partials/footer.html'),
  ]);
  document.dispatchEvent(new Event('includes:loaded'));
})();
