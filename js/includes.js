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
  // Clone the about-photo above the main content so it can appear on top
  // when the sidebar stacks below on mobile.
  const photo = document.querySelector('.page-sidebar .about-photo');
  const container = document.querySelector('main .container');
  if (photo && container) {
    const clone = photo.cloneNode(true);
    clone.classList.add('mobile-photo');
    container.prepend(clone);
  }
  document.dispatchEvent(new Event('includes:loaded'));
})();
