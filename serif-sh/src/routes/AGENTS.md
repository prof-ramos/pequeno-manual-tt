<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# routes

## Purpose

SvelteKit routes: pages and API endpoints. The main page (`+page.svelte`) is the interactive quote editor. API routes handle programmatic image generation and other server-side functionality.

## Key Files

| File | Description |
|------|-------------|
| `+page.svelte` | Main interactive page — quote editor with controls |
| `+layout.svelte` | Root layout wrapper |
| `+error.svelte` | Error page |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | API endpoints (see `api/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `+page.svelte` reads query params on mount for API usage and applies them via `setSilent()`
- URL query params (`?quote=...&theme=...`) are for programmatic access; hash (`#quote=...`) is for UI sharing
- The page uses `$state` and `$effect` (Svelte 5 runes), not legacy `$:` reactive statements

### Testing Requirements
- Load page with query params: verify quote and theme are pre-configured
- Check that query params do NOT pollute the shareable URL hash
- Verify theme switching works and updates the preview

### Common Patterns
- `urlState` derived from `window.location.search`
- `$effect()` to apply URL state to stores on mount
- `selectedThemeId`, `quoteText`, `authorName` stores control the frame

## Dependencies

### Internal
- `$lib/components/quote-frame.svelte` — core rendering
- `$lib/stores` — all reactive state
- `api/generate/` — server-side image generation endpoint

### External
- SvelteKit routing
- Tailwind CSS

<!-- MANUAL: -->
