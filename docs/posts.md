# Post format (markdown frontmatter)

Every post file lives in `posts/` as `YYYY-MM-DD-slug.md` and starts with a YAML-like frontmatter block delimited by `---`:

```markdown
---
title: Tittelen på innlegget
date: 2025-06-01
category: teknologi
tags: [ai, verktøy, refleksjon]
excerpt: En kort beskrivelse som vises på forsiden.
---

Brødteksten starter her...
```

The JS parser must read everything between the first and second `---` and extract these fields. Fail gracefully if a field is missing (omit it, do not crash).
