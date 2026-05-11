# HTML conventions

## Page shell

Every page follows the same shell. Look at `index.html` for the canonical example, and reuse the shared header/footer via `js/includes.js` (which injects them client-side).

- `lang="nb"` always (bokmål)
- `data-theme` on `<html>`: `"dark"` (default) or `"light"` — switches the minium color scheme
- Scripts at end of `<body>`

## Layout classes (from minium.css)

Use these — do not recreate them:

| Class | Purpose |
|---|---|
| `.container` | Centered wrapper, max 75rem, responsive padding |
| `.container.slim` | Narrow content column, max 68ch — use for post body |
| `.flow` | Vertical rhythm via `margin-block-start` |
| `.cluster` | Horizontal flex group with wrapping (tags, nav items) |
| `.repel` | Space-between flex row (header logo + nav) |
| `.grid` | Auto-fill grid for post cards |
| `.sidebar` | Two-column layout: fixed sidebar + growing content |
| `.eyebrow` | Small uppercase label above a heading |

## Post card pattern

```html
<article class="flow">
  <span class="eyebrow"><!-- category --></span>
  <h2><a href="/post.html?p=YYYY-MM-DD-slug" class="tertiary"><!-- title --></a></h2>
  <p class="cluster" style="--cluster-vertical-alignment: baseline">
    <small><!-- date --></small>
    <!-- tags rendered as: <a href="/?tag=foo" class="tag">foo</a> -->
  </p>
  <p><!-- excerpt --></p>
</article>
```
