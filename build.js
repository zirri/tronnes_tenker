const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
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
  return meta;
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const posts = files.flatMap(file => {
  const slug = file.replace(/\.md$/, '');
  const text = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const meta = parseFrontmatter(text);
  if (!meta) {
    console.warn(`Hopper over ${file}: mangler frontmatter`);
    return [];
  }
  return [{ slug, ...meta }];
});

posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

fs.writeFileSync(
  path.join(postsDir, 'index.json'),
  JSON.stringify(posts, null, 2)
);
console.log(`Ferdig: ${posts.length} innlegg skrevet til posts/index.json`);
