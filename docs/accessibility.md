# Accessibility (WCAG 2.2 AA)

WCAG 2.2 AA compliance is required throughout. When in doubt, be more accessible, not less.

## Semantic HTML

- Use the correct element for the job: `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`, `<time>`, `<figure>`, `<figcaption>`
- One `<h1>` per page; heading levels must not skip (h1 → h2 → h3, never h1 → h3)
- Post dates use `<time datetime="YYYY-MM-DD">` with a human-readable inner text
- Tag/category filters: use `<nav aria-label="Filter etter tagg">` wrapping the tag list

## Keyboard and focus

- All interactive elements must be reachable and operable by keyboard alone
- Focus ring must always be visible — minium provides `:focus-visible` styles; never suppress them with `outline: none`
- Tag filter links and nav links must have clearly visible focus indicators
- Skip-to-content link as first child of `<body>`:

```html
<a href="#main-content" class="skip-link">Hopp til innhold</a>
```

Define `.skip-link` in `blog.css`: visually hidden until focused, then positioned at top of viewport.

## Color and contrast

- All text must meet AA contrast ratios: 4.5:1 for normal text, 3:1 for large text (≥18pt or ≥14pt bold)
- Verify primary and accent colors against `--color-surface` and `--color-surface-raised` before shipping
- Never convey information by color alone — tags must also differ by text, not just color
- The `--color-primary-text` and `--color-accent-text` values shipped in minium are chosen for AA compliance on light backgrounds; verify on dark backgrounds too

## Images and media

- Every `<img>` must have an `alt` attribute — empty (`alt=""`) only for decorative images
- Rendered markdown may include images: set `marked` options to sanitize and warn when `alt` is missing (do not silently drop it)

## ARIA

- Use ARIA only when native HTML semantics are insufficient
- `aria-current="page"` on the active nav link
- `aria-live="polite"` on the post list container so screen readers announce filter results
- `aria-label` on icon-only buttons (e.g. a future theme toggle)

## Forms and interactive widgets (future)

- Every input must have a visible `<label>` — no placeholder-only labels
- Error messages must be associated via `aria-describedby`

## Testing checklist (before marking any feature done)

- [ ] Keyboard-only navigation works end to end
- [ ] No contrast failures at default light and dark themes (use browser DevTools or axe)
- [ ] Screen reader announces page content in logical order
- [ ] All images have meaningful alt text
- [ ] No missing `lang` attribute, no skipped heading levels
