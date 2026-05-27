# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo contains two parts:

1. **`serif-sh/`** — A SvelteKit 5 web app that renders beautiful, themeable quote snapshots. It can export images client-side (html-to-image) or server-side via a Playwright-powered API endpoint (`/api/generate`).
2. **`scripts/`** — Python automation scripts that post daily quotes from "Pequeno Manual de Instruções para a Vida" (1001 quotes) to X (Twitter), using the `/api/generate` endpoint to create the images.

## Common Commands

All npm commands run from `serif-sh/`:

```bash
cd serif-sh

# Install dependencies + Playwright Chromium
npm install
npx playwright install chromium

# Dev server (runs on http://localhost:5173)
npm run dev

# Production build
npm run build

# Type-check
npm run check

# Run tests (Vitest)
npm run test        # if a test script exists; currently tests are picked up by vite.config.ts include pattern
```

Python scripts run from `scripts/`:

```bash
cd scripts
pip install -r requirements.txt

# Post today's quote (deterministic by day-of-year)
python daily-post.py

# Post a specific quote (1–1001)
python daily-post.py --quote 42

# Post a random quote
python daily-post.py --random

# Test without posting (saves image to scripts/output/)
python daily-post.py --test

# Use a different theme (default: noir)
python daily-post.py --theme editorial

# Generate preview images for quotes 1–10
python generate-previews.py
```

## Architecture

### State Management: Two URL Systems

The app uses **two separate URL state systems** that must not be confused:

1. **Hash-based stores** (`#quote=...&theme=...`) — Used for the interactive UI and shareable links. Quote and author values are **base64-encoded** in the hash to handle special characters safely. Other settings (theme, alignment, padding, font, marks, bg, width) are stored as plain strings.
   - `src/lib/stores/quote.ts` — `quoteText` and `authorName` stores with base64 hash sync.
   - `src/lib/stores/settings.ts` — `selectedThemeId`, `alignment`, `padding`, `selectedFontId`, `showBackground`, `showQuoteMarks`, `frameWidth` stores with plain hash sync.

2. **Query params** (`?quote=...&theme=...`) — Used by the `/api/generate` endpoint and the Python scripts for programmatic image generation. These are **not** base64-encoded.

The `+page.svelte` reads query params on mount and applies them to the stores via `setSilent()` so the API can pre-configure the frame without polluting the shareable hash state.

### The `setSilent()` Pattern

`quoteText.setSilent()` and `authorName.setSilent()` update the store value **without writing to the URL hash**. This is critical because:
- Theme-specific default quotes should not persist in the URL (a fresh visit should not inherit them).
- The API endpoint passes quote/theme via query params, which are translated to store values but must not overwrite the user's shareable hash.

### Contenteditable Cursor Handling

The quote and author fields are `contenteditable` divs. **Do not bind Svelte reactive stores directly inside contenteditable** — every keystroke would re-render the text node and destroy the cursor position. Instead, the `editableStore` action in `quote-frame.svelte` subscribes to the store and only updates `textContent` when the element is **not** focused. On `input` events, it writes back to the store. This pattern must be preserved when modifying the quote frame.

### Theme System

Themes are defined in `src/lib/themes.ts`. Each `Theme` has:
- `id`, `name`, `quoteStyle` (determines the visual layout variant)
- `background`, `text`, `accent`, `quoteMark`, `border` colors
- `font` and optional `authorFont`
- Optional `brand` (`'vercel' | 'peerlist' | 'x'`) — enables brand logo toggles and dark-mode toggle
- Optional `backgroundImage` / `backgroundSize` for image/gradient backgrounds

The `QuoteFrame` component (`src/lib/components/quote-frame.svelte`) uses `{#if theme.quoteStyle === '...'}` blocks to render completely different DOM structures per style. Adding a new theme usually means adding a new `QuoteStyle` variant and a corresponding block in `quote-frame.svelte`.

### Image Generation

- **Client-side**: `src/lib/utils/export.ts` uses `html-to-image` (`toBlob` / `toSvg`) with `pixelRatio: 2` and waits for `document.fonts.ready` before capturing.
- **Server-side**: `src/routes/api/generate/+server.ts` dynamically imports Playwright, launches Chromium headless, navigates to the page with query params, waits for `.quote-frame`, waits 1s for fonts, then screenshots the `.quote-frame` element. Returns PNG with `Cache-Control: public, max-age=3600`.

### Data Files

- `serif-sh/src/lib/conselhos.json` — 1001 numbered quotes from the book.
- `serif-sh/src/lib/conselhos.py` — Same data as a Python dict, imported by the scripts.

### Styling

- Tailwind CSS v4 with `@theme` configuration in `src/app.css`.
- Custom font faces for Instrument Serif and Open Runde (self-hosted in `/static/fonts/`).
- Google Fonts loaded in `app.html` for Geist, Inter, Old Standard TT, JetBrains Mono, Playfair Display.
- Custom utilities: `scrollbar-none`, `card-shadow`, `border-shadow`, `border-shadow-hover`, `glassmorphism`.
- X brand themes use the `.quote-card.style-x` class in `app.css` to apply an Inter + system-ui font stack with antialiased smoothing.

## Environment Variables for Scripts

The Python scripts read these env vars:

- `SERIF_SH_URL` — Base URL of the running serif.sh server (default: `http://localhost:5173`)
- `TWITTER_BEARER_TOKEN` — **OAuth 2.0 User Access Token** with `tweet.write` scope. This is **not** the Bearer Token from the app dashboard; it is the token generated via OAuth 2.0 User Authentication flow.

### X API Authentication Setup

Posting tweets requires an **OAuth 2.0 User Access Token** with `tweet.write` scope. The app must be attached to a Project in the X Developer Portal.

**Steps to generate the token:**
1. Create an app in https://developer.twitter.com/en/portal/projects-and-apps (must be inside a Project)
2. Enable **User Authentication** → OAuth 2.0 → Type: **Web App, Automated App or Bot**
3. Set Callback URI to `http://localhost:3000/callback` (or `http://localhost/`)
4. Generate an **OAuth 2.0 User Authentication Token** with scope `tweet.write`
5. Set `TWITTER_BEARER_TOKEN` to this token's value

**Important limitation:** The Free tier has virtually zero write credits. You will likely get `402 CreditsDepleted` even with zero usage. Options:
- Wait for monthly reset (~8th of each month)
- Upgrade to Basic tier ($100/month)
- Use `--save-only` to generate images without posting

**Endpoints used:** `https://api.x.com/2/media/upload` and `https://api.x.com/2/tweets`

## Important File Paths

| Path | Purpose |
|------|---------|
| `serif-sh/src/lib/themes.ts` | Theme definitions and font registry |
| `serif-sh/src/lib/stores/settings.ts` | Hash-synced stores for UI settings |
| `serif-sh/src/lib/stores/quote.ts` | Hash-synced stores for quote/author (base64) |
| `serif-sh/src/lib/components/quote-frame.svelte` | Core rendering component with all theme layouts |
| `serif-sh/src/lib/utils/export.ts` | Client-side PNG/SVG export via html-to-image |
| `serif-sh/src/routes/api/generate/+server.ts` | Server-side Playwright PNG generation endpoint |
| `scripts/daily-post.py` | Daily automation script for X posting |
| `scripts/generate-previews.py` | Bulk image generation for previews |
| `serif-sh/src/lib/conselhos.json` | Source data: 1001 quotes |
