# Trønnes tenker

Personlig blogg. Bygget med plain HTML, CSS og vanilla JS. Hostet på Cloudflare Pages.

## Lokal utvikling

Du trenger Node.js installert (kun for byggskriptet og lokal server).

### 1. Generer innleggsindeks

Etter at du har lagt til eller endret et innlegg i `posts/`, kjør:

```bash
node build.js
```

Dette leser alle `.md`-filer i `posts/`, parser frontmatter og skriver `posts/index.json`. Filen committes til repoet slik at siden fungerer lokalt uten å kjøre bygget.

### 2. Start lokal server

Åpne filen direkte i nettleseren (`file://`) fungerer **ikke** — nettleseren blokkerer `fetch()`-kall til lokale filer. Bruk `npx serve`:

```bash
npx --yes serve .
```

Åpne deretter [http://localhost:3000](http://localhost:3000). `--yes` aksepterer installasjonsprompten første gang `serve` kjøres.

## Skrive et nytt innlegg

1. Opprett en ny fil i `posts/` med formatet `YYYY-MM-DD-slug.md`
2. Start filen med frontmatter:

```markdown
---
title: Tittelen på innlegget
date: 2026-05-09
category: teknologi
tags: [ai, verktøy]
excerpt: En kort beskrivelse som vises på forsiden.
---

Brødteksten starter her...
```

3. Kjør `node build.js` for å oppdatere `posts/index.json`
4. Commit begge filene

## Cloudflare Pages

- **Build command:** `node build.js`
- **Output directory:** `/` (rot)
- `404.html` plukkes opp automatisk av Cloudflare Pages

## Prosjektstruktur

```
/
├── index.html          # Forside med innleggsliste og filter
├── post.html           # Innleggsvisning
├── 404.html            # Feilside
├── build.js            # Genererer posts/index.json
├── agents.md           # Retningslinjer for AI-agenter
├── assets/styles/      # CSS-rammeverk (ikke rediger)
├── css/
│   └── blog.css        # Blogspesifikke stiler
├── js/
│   └── blog.js         # Klientlogikk
└── posts/
    ├── index.json      # Generert av build.js — ikke rediger manuelt
    └── *.md            # Innlegg
```
