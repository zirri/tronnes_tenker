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

function filterUrl(key, val) {
  const p = new URLSearchParams(window.location.search);
  if (p.get(key) === val) {
    p.delete(key);
  } else {
    p.set(key, val);
    p.delete(key === 'tag' ? 'category' : 'tag');
  }
  const qs = p.toString();
  return qs ? '?' + qs : window.location.pathname;
}

function postCard(post) {
  const date = formatDate(post.date);
  const tags = (post.tags || []).map(t =>
    `<a href="${filterUrl('tag', t)}" class="tag">${t}</a>`
  ).join('');
  return `<article class="flow">
    ${post.category ? `<span class="eyebrow">${post.category}</span>` : ''}
    <h2><a href="/post?p=${post.slug}" class="tertiary">${post.title || post.slug}</a></h2>
    <p class="cluster" style="--cluster-vertical-alignment:baseline">
      ${date ? `<time datetime="${post.date}">${date}</time>` : ''}
      ${tags}
    </p>
    ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
  </article>`;
}

function update(posts) {
  const p = new URLSearchParams(window.location.search);
  const activeTag = p.get('tag');
  const activeCat = p.get('category');

  const filtered = posts.filter(post => {
    if (activeTag) return (post.tags || []).includes(activeTag);
    if (activeCat) return post.category === activeCat;
    return true;
  });

  document.querySelectorAll('[data-filter-key]').forEach(el => {
    const key = el.dataset.filterKey;
    const val = el.dataset.filterVal;
    const isActive = (key === 'tag' && val === activeTag) || (key === 'category' && val === activeCat);
    el.setAttribute('href', filterUrl(key, val));
    el.setAttribute('aria-current', isActive ? 'true' : 'false');
  });

  const list = document.getElementById('post-list');
  list.innerHTML = filtered.length
    ? filtered.map(postCard).join('')
    : '<p>Ingen innlegg funnet.</p>';

  const status = document.getElementById('post-count');
  if (status) {
    status.textContent = activeTag || activeCat
      ? `Viser ${filtered.length} av ${posts.length} innlegg`
      : `${posts.length} innlegg`;
  }
}

async function initIndex() {
  const list = document.getElementById('post-list');
  let posts = [];
  try {
    const res = await fetch('/posts/index.json');
    if (!res.ok) throw new Error(res.status);
    posts = await res.json();
  } catch {
    list.innerHTML = '<p>Kunne ikke laste innlegg.</p>';
    return;
  }

  const cats = [...new Set(posts.map(p => p.category).filter(Boolean))].sort();
  const tags = [...new Set(posts.flatMap(p => p.tags || []))].sort();

  const catList = document.getElementById('category-list');
  const tagList = document.getElementById('tag-list');

  if (catList) catList.innerHTML = cats.map(c =>
    `<li><a href="${filterUrl('category', c)}" class="tag" data-filter-key="category" data-filter-val="${c}">${c}</a></li>`
  ).join('');

  if (tagList) tagList.innerHTML = tags.map(t =>
    `<li><a href="${filterUrl('tag', t)}" class="tag" data-filter-key="tag" data-filter-val="${t}">${t}</a></li>`
  ).join('');

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
  const tags = (meta.tags || []).map(t =>
    `<a href="/?tag=${encodeURIComponent(t)}" class="tag">${t}</a>`
  ).join('');

  container.innerHTML = `<article class="flow">
    ${meta.category ? `<p><a href="/?category=${encodeURIComponent(meta.category)}" class="tag">${meta.category}</a></p>` : ''}
    <h1>${meta.title || slug}</h1>
    ${date || tags ? `<p class="cluster" style="--cluster-vertical-alignment:baseline">
      ${date ? `<time datetime="${meta.date}">${date}</time>` : ''}
      ${tags}
    </p>` : ''}
    <hr>
    <div class="flow">${marked.parse(body)}</div>
  </article>`;
}

if (document.getElementById('post-list')) initIndex();
if (document.getElementById('post-content')) initPost();
