<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# api

## Purpose

SvelteKit API endpoints (server routes). Provides programmatic access to the application's functionality: server-side image generation via Playwright, quote parsing utilities, and analytics tracking.

## Key Files

| File | Description |
|------|-------------|
| `generate/+server.ts` | **Primary endpoint** — Playwright headless screenshot of quote frame. Accepts query params for quote, theme, font, etc. Returns PNG. Used by `scripts/daily-post.py`. |
| `parse-quote/+server.ts` | Parses raw quote text into structured data (quote, author, source) |
| `track/+server.ts` | Analytics/tracking endpoint |

## For AI Agents

### Working In This Directory
- `generate/+server.ts` is the most important endpoint — it dynamically imports Playwright, launches Chromium, navigates to the page with query params, screenshots `.quote-frame`
- The endpoint waits for `networkidle` and then an extra 1s for font loading
- Returns PNG with `Cache-Control: public, max-age=3600`
- Query params are passed to the page via URL: `/?quote=...&theme=...&number=...`

### Testing Requirements
- `curl "http://localhost:5175/api/generate?quote=test&theme=noir"` — should return PNG bytes
- Verify Playwright Chromium is installed: `npx playwright install chromium`

### Common Patterns
- Dynamic import of Playwright: `const { chromium } = await import('playwright')`
- Viewport: 1200x630 (standard social card size)
- Screenshot target: `.quote-frame` element
- Error response: JSON with 500 status

## Dependencies

### Internal
- `src/routes/+page.svelte` — the page being screenshot
- `src/lib/components/quote-frame.svelte` — the element being captured

### External
- Playwright (Chromium)
- SvelteKit server handlers (`RequestHandler`)

<!-- MANUAL: -->
