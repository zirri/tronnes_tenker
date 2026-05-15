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
    inject('[data-include="sidebar"]', '/partials/sidebar.html'),
    inject('[data-include="footer"]', '/partials/footer.html'),
  ]);
  document.dispatchEvent(new Event('includes:loaded'));
})();
