const STORAGE_KEY = 'tt-draft-v1';

const fields = ['title', 'slug', 'date', 'category', 'tags', 'excerpt', 'body'];
const el = Object.fromEntries(fields.map(f => [f, document.getElementById('f-' + f)]));
const out = document.getElementById('f-output');
const preview = document.getElementById('preview-article');
const saveStatus = document.getElementById('save-status');

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function todayISO() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDate(str) {
  if (!str) return '';
  return new Date(str + 'T00:00:00').toLocaleDateString('nb-NO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function parseTags(s) {
  return (s || '').split(',').map(t => t.trim()).filter(Boolean);
}

function deriveExcerpt(body, maxLen = 200) {
  const firstPara = (body || '')
    .replace(/^\s+/, '')
    .split(/\r?\n\s*\r?\n/)
    .find(p => p.trim() && !p.trim().startsWith('#'));
  if (!firstPara) return '';
  const plain = firstPara
    .replace(/\r?\n/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLen) return plain;
  const cut = plain.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function buildMarkdown(state) {
  const lines = ['---'];
  if (state.title) lines.push(`title: ${state.title}`);
  if (state.date) lines.push(`date: ${state.date}`);
  if (state.category) lines.push(`category: ${state.category}`);
  const tags = parseTags(state.tags);
  if (tags.length) lines.push(`tags: [${tags.join(', ')}]`);
  const excerpt = state.excerpt.trim() || deriveExcerpt(state.body);
  if (excerpt) lines.push(`excerpt: ${excerpt}`);
  lines.push('---', '', state.body || '');
  return lines.join('\n');
}

function renderPreview(state) {
  const tags = parseTags(state.tags);
  const date = formatDate(state.date);
  const tagsHtml = tags.map(t =>
    `<a href="#" class="pill accent" onclick="event.preventDefault()">${escapeHtml(t)}</a>`
  ).join('');

  const hasAnything = state.title || state.body || state.category || tags.length || date;
  if (!hasAnything) {
    preview.innerHTML = '<p class="weak"><em>Begynn å skrive for å se forhåndsvisning.</em></p>';
    return;
  }

  const bodyHtml = state.body ? marked.parse(state.body) : '';
  const metaLine = (date || tagsHtml)
    ? `<p class="cluster" style="--cluster-vertical-alignment:baseline">
         ${date ? `<time datetime="${escapeHtml(state.date)}">${escapeHtml(date)}</time>` : ''}
         ${tagsHtml}
       </p>`
    : '';

  preview.innerHTML = `
    ${state.category ? `<p><a href="#" class="pill accent" onclick="event.preventDefault()">${escapeHtml(state.category)}</a></p>` : ''}
    <h1>${escapeHtml(state.title || '(uten tittel)')}</h1>
    ${metaLine}
    <hr>
    <div class="flow">${bodyHtml}</div>
  `;
}

function getState() {
  return Object.fromEntries(fields.map(f => [f, el[f].value]));
}

function setState(state) {
  for (const f of fields) {
    if (state[f] != null) el[f].value = state[f];
  }
}

let saveTimer;
function save(state) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveStatus.textContent = 'Lagret kladd';
    setTimeout(() => { saveStatus.textContent = ''; }, 1500);
  }, 400);
}

function suggestedFilename(state) {
  const slug = state.slug || slugify(state.title) || 'utkast';
  const date = state.date || todayISO();
  return `${date}-${slug}.md`;
}

let slugManuallyEdited = false;

function update() {
  const state = getState();

  if (!slugManuallyEdited) {
    const auto = slugify(state.title);
    if (auto !== el.slug.value) {
      el.slug.value = auto;
      state.slug = auto;
    }
  }

  out.value = buildMarkdown(state);
  renderPreview(state);
  save(state);
}

function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const state = JSON.parse(saved);
      setState(state);
      if (state.slug && state.slug !== slugify(state.title)) slugManuallyEdited = true;
    } catch {}
  }
  if (!el.date.value) el.date.value = todayISO();

  for (const f of fields) {
    el[f].addEventListener('input', update);
  }
  el.slug.addEventListener('input', () => { slugManuallyEdited = !!el.slug.value; });

  document.getElementById('copy-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(out.value);
      saveStatus.textContent = 'Kopiert!';
      setTimeout(() => { saveStatus.textContent = ''; }, 1500);
    } catch {
      out.select();
      document.execCommand('copy');
    }
  });

  document.getElementById('download-btn').addEventListener('click', () => {
    const state = getState();
    const blob = new Blob([out.value], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = suggestedFilename(state);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    if (!confirm('Tøm kladd? Dette kan ikke angres.')) return;
    localStorage.removeItem(STORAGE_KEY);
    for (const f of fields) el[f].value = '';
    el.date.value = todayISO();
    slugManuallyEdited = false;
    update();
  });

  update();
}

init();
