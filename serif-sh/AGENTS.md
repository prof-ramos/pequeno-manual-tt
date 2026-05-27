<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# serif-sh

## Purpose

A SvelteKit 5 web application that renders beautiful, themeable quote snapshots. Users can customize quotes, themes, fonts, alignment, and padding, then export as PNG/SVG. A Playwright-powered server-side API (`/api/generate`) enables programmatic image generation for external scripts.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies: SvelteKit 5, Tailwind v4, Playwright |
| `vite.config.ts` | Vite config with Tailwind plugin, HMR overlay disabled |
| `svelte.config.js` | SvelteKit adapter config |
| `tsconfig.json` | TypeScript configuration |
| `src/app.css` | Tailwind v4 `@theme` config + custom utilities |
| `src/app.html` | HTML template with Google Fonts |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code (see `src/AGENTS.md`) |
| `static/` | Static assets: fonts, favicon (see `static/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `npm install` then `npx playwright install chromium` — required setup
- `npm run dev` — dev server (may use ports 5173, 5174, 5175...)
- `npm run check` — TypeScript type-checking
- `npm run build` — production build

### Testing Requirements
- `npm run check` — catches TypeScript errors
- `npm run test` — Vitest (if configured)
- Manual: open dev server in browser and verify image generation

### Common Patterns
- Svelte 5 runes: `$state`, `$effect`, `$derived`
- `contenteditable` fields use `editableStore` action (never bind stores directly)
- Dual URL state: hash (base64) for UI, query params (plain) for API
- Themes are conditional DOM blocks in `quote-frame.svelte`, not CSS-only

## Dependencies

### External
- SvelteKit 5 / Svelte 5 runes
- Tailwind CSS v4
- Playwright (Chromium) — server-side screenshot generation
- html-to-image — client-side PNG/SVG export

<!-- MANUAL: -->
