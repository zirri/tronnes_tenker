# CSS conventions

All blog-specific styles go in `/css/blog.css` under `@layer project { }`. Never edit `/assets/styles/`.

The minium framework in `/assets/styles/` already ships with the site's correct color palette — do not redefine `--color-primary*` or `--color-accent*` in `blog.css`.

## Tag styling

Tags are `<a>` elements with class `.tag`. Define in `blog.css`:

```css
@layer project {
  .tag {
    font-size: var(--size-tiny);
    padding: var(--space-3xs) var(--space-2xs);
    border-radius: var(--border-radius-f);
    background-color: var(--color-accent-fill);
    color: var(--color-accent-text);
    text-decoration: none;
    font-weight: var(--font-weight-bold);
    border: var(--border-width) solid var(--color-accent-border-weak);

    &:hover {
      background-color: var(--color-accent-fill-hover);
      border-color: var(--color-accent-border-strong);
    }
  }
}
```

## General rules

- Use minium CSS custom properties (`--space-*`, `--size-*`, `--color-*`) — do not hardcode values
- Do not write utility classes — use the minium layout primitives or inline `style` with CSS variables
- Keep `blog.css` minimal — only what minium does not already handle
