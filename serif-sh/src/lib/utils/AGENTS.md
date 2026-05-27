<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# utils

## Purpose

Utility functions for the application. Currently focused on client-side image export using `html-to-image` library.

## Key Files

| File | Description |
|------|-------------|
| `export.ts` | Client-side PNG/SVG export via `html-to-image` with `pixelRatio: 2` and font readiness wait |

## For AI Agents

### Working In This Directory
- `export.ts` is used by `ExportButton` component for client-side capture
- Server-side capture is handled separately in `src/routes/api/generate/+server.ts` via Playwright

### Testing Requirements
- Export PNG and verify resolution is 2x (1200x630 viewport → 2400x1260 output)
- Verify fonts are loaded before capture (`document.fonts.ready`)

### Common Patterns
- `toBlob()` and `toSvg()` from `html-to-image`
- `pixelRatio: 2` for high-DPI exports
- `document.fonts.ready` wait before capture to prevent missing fonts

## Dependencies

### External
- `html-to-image` — DOM-to-image library

<!-- MANUAL: -->
