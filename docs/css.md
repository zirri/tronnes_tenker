# CSS conventions

All blog-specific styles go in `/css/blog.css` under `@layer project { }`. Never edit `/assets/styles/`.

The minium framework in `/assets/styles/` already ships with the site's correct color palette — do not redefine `--color-primary*` or `--color-accent*` in `blog.css`.

## Tag styling

Tags are `<a>` elements rendered with the minium badge component: `class="pill accent"`. This gives the accent-coloured, fully rounded chip with hover state for free — do not redefine the base styles in `blog.css`.

Project-specific overrides (cosmic active-state glow, hover shadow) live in `blog.css` and target `a.pill` / `a.pill[aria-current="true"]`.

## General rules

- Use minium CSS custom properties (`--space-*`, `--size-*`, `--color-*`) — do not hardcode values
- Do not write utility classes — use the minium layout primitives or inline `style` with CSS variables
- Keep `blog.css` minimal — only what minium does not already handle
