async function inject(selector, url) {
  const slot = document.querySelector(selector);
  if (!slot) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    slot.outerHTML = await res.text();
  } catch {
    slot.outerHTML = '';
  }
}

(async () => {
  await Promise.all([
    inject('[data-include="header"]', '/partials/header.html'),
    inject('[data-include="footer"]', '/partials/footer.html'),
  ]);

  const navKey = document.body.dataset.nav;
  if (navKey) {
    const link = document.querySelector(`[data-nav="${navKey}"]`);
    if (link) link.setAttribute('aria-current', 'page');
  }

  document.dispatchEvent(new Event('includes:loaded'));
})();
