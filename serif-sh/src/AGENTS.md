<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# src

## Purpose

Source code root for the SvelteKit application. Contains all application logic: Svelte components, reactive stores, utility functions, SvelteKit routes (pages + API), and the core data file with 1001 quotes.

## Key Files

| File | Description |
|------|-------------|
| `app.css` | Tailwind v4 `@theme` config, custom utilities, scrollbar-none, card-shadow |
| `app.html` | HTML template with Google Fonts (Geist, Inter, Playfair Display, etc.) |
| `lib/conselhos.json` | 1001 numbered quotes from the book |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `lib/` | Core library: components, stores, utils, themes (see `lib/AGENTS.md`) |
| `routes/` | SvelteKit pages and API endpoints (see `routes/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All imports use `$lib/` alias (configured in `svelte.config.js`)
- Svelte 5 runes (`$state`, `$effect`, `$derived`) are used throughout
- Do not use legacy Svelte reactive statements (`$:`) in new code

### Testing Requirements
- `npm run check` — TypeScript validation across all src files

### Common Patterns
- Barrel exports via `index.ts` in `$lib/`
- Store files in `$lib/stores/` with separate `quote.ts` for quote-specific stores

## Dependencies

### Internal
- `lib/` — all components and utilities
- `routes/` — pages and API handlers

### External
- Tailwind CSS v4
- Svelte 5 runes

<!-- MANUAL: -->
