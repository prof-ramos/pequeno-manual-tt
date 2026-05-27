<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# static

## Purpose

Static assets served directly by SvelteKit. Contains self-hosted font files and favicon. Fonts are loaded via `app.html` and referenced in Tailwind config.

## Key Files

| File | Description |
|------|-------------|
| `favicon.png` | Site favicon |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `fonts/` | Self-hosted font files (see `fonts/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Add new static assets here; they are served at root path automatically
- Font files must be referenced in `src/app.css` with `@font-face` declarations

### Common Patterns
- Instrument Serif and Open Runde are self-hosted in `fonts/`
- Google Fonts (Geist, Inter, Playfair Display, etc.) are loaded via CDN in `app.html`

## Dependencies

### External
- Tailwind CSS — references font families defined here

<!-- MANUAL: -->
