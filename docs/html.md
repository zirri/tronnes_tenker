# HTML conventions

## Page shell

Every page uses this shell:

```html
<!doctype html>
<html lang="nb" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- page title --> — Trønnes tenker</title>
  <link rel="stylesheet" href="/dist/minium.min.css">
  <link rel="stylesheet" href="/css/blog.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Hopp til innhold</a>

  <header>
    <div class="container repel">
      <a href="/" class="tertiary">Trønnes tenker</a>
      <nav aria-label="Nettstednavigasjon">
        <!-- nav links with aria-current="page" on active link -->
      </nav>
    </div>
  </header>

  <main id="main-content">
    <!-- page content -->
  </main>

  <footer>
    <div class="container">
      <!-- footer content -->
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="/js/blog.js"></script>
</body>
</html>
```

- `lang="nb"` always (bokmål)
- `data-theme` on `<html>`: `"light"` by default; toggling to `"dark"` switches the minium color scheme
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
