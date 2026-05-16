function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();
    if (val.startsWith('[')) {
      meta[key] = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    } else {
      meta[key] = val;
    }
  }
  return { meta, body: match[2] };
}

function formatDate(str) {
  if (!str) return '';
  return new Date(str + 'T00:00:00').toLocaleDateString('nb-NO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function filterUrl(val) {
  const p = new URLSearchParams(window.location.search);
  if (p.get('category') === val) {
    p.delete('category');
  } else {
    p.set('category', val);
  }
  const qs = p.toString();
  return qs ? '?' + qs : window.location.pathname;
}

function postCard(post) {
  const date = formatDate(post.date);
  return `<article class="flow">
    <div class="repel">
      <span class="eyebrow">${post.category || ''}</span>
      ${date ? `<time class="eyebrow" datetime="${post.date}">${date}</time>` : ''}
    </div>
    <h2><a href="/post?p=${post.slug}" class="tertiary">${post.title || post.slug}</a></h2>
    ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
  </article>`;
}

function update(posts) {
  const p = new URLSearchParams(window.location.search);
  const activeCat = p.get('category');

  const filtered = activeCat
    ? posts.filter(post => post.category === activeCat)
    : posts;

  document.querySelectorAll('[data-filter-val]').forEach(el => {
    const val = el.dataset.filterVal;
    el.setAttribute('href', filterUrl(val));
    el.setAttribute('aria-current', val === activeCat ? 'true' : 'false');
  });

  const list = document.getElementById('post-list');
  const cards = filtered.length
    ? filtered.map(postCard).join('')
    : '<p>Ingen innlegg funnet.</p>';
  const clearLink = activeCat
    ? `<p style="--flow-space: var(--space-l)"><a href="/" class="secondary">‹ Alle innlegg</a></p>`
    : '';
  list.innerHTML = cards + clearLink;

  const status = document.getElementById('post-count');
  if (status) {
    if (activeCat) {
      status.textContent = `Viser innlegg med kategori «${activeCat}»`;
      status.hidden = false;
    } else {
      status.textContent = '';
      status.hidden = true;
    }
  }
}

async function fetchPosts() {
  try {
    const res = await fetch('/posts/index.json');
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return null;
  }
}

async function renderSidebarCategories(posts, hrefFn) {
  if (!document.getElementById('category-list')) {
    await new Promise(resolve =>
      document.addEventListener('includes:loaded', resolve, { once: true })
    );
  }
  const catList = document.getElementById('category-list');
  if (!catList) return;
  const cats = [...new Set(posts.map(p => p.category).filter(Boolean))].sort();
  catList.innerHTML = cats.map(c =>
    `<li><a href="${hrefFn(c)}" class="pill accent" data-filter-val="${c}">${c}</a></li>`
  ).join('');
}

async function initIndex() {
  const list = document.getElementById('post-list');
  const posts = await fetchPosts();
  if (!posts) {
    list.innerHTML = '<p>Kunne ikke laste innlegg.</p>';
    return;
  }

  await renderSidebarCategories(posts, filterUrl);
  update(posts);

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname) return;
    e.preventDefault();
    history.pushState(null, '', link.href);
    update(posts);
  });

  window.addEventListener('popstate', () => update(posts));
}

async function initSidebarOnly() {
  const posts = await fetchPosts();
  if (!posts) return;
  await renderSidebarCategories(posts, c => `/?category=${encodeURIComponent(c)}`);
}

async function initPost() {
  const slug = new URLSearchParams(window.location.search).get('p');
  const container = document.getElementById('post-content');
  if (!slug || !container) return;

  let text;
  try {
    const res = await fetch(`/posts/${slug}.md`);
    if (!res.ok) throw new Error(res.status);
    text = await res.text();
  } catch {
    container.innerHTML = '<p>Innlegget ble ikke funnet.</p>';
    return;
  }

  const { meta, body } = parseFrontmatter(text);
  if (meta.title) document.title = `${meta.title} — Trønnes tenker`;

  const date = formatDate(meta.date);

  container.innerHTML = `<article class="flow">
    <div class="repel">
      <span class="eyebrow">${meta.category || ''}</span>
      ${date ? `<time class="eyebrow" datetime="${meta.date}">${date}</time>` : ''}
    </div>
    <h1>${meta.title || slug}</h1>
    <hr>
    <div class="flow">${marked.parse(body)}</div>
    <p class="post-back" style="--flow-space: var(--space-l)"><a href="/" class="secondary">‹ Alle innlegg</a></p>
  </article>`;
}

if (document.getElementById('post-list')) {
  initIndex();
} else {
  initSidebarOnly();
}
if (document.getElementById('post-content')) initPost();
