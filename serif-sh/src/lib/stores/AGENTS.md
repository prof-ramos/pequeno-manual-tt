<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# stores

## Purpose

Svelte reactive stores that manage all application state. Uses two URL persistence systems: base64-encoded hash for quote/author (shareable links), and plain hash for UI settings. Includes a dedicated `quote.ts` for quote-specific stores.

## Key Files

| File | Description |
|------|-------------|
| `settings.ts` | Hash-synced stores: theme, alignment, padding, font, frame width, toggles |
| `quote.ts` | Base64 hash-synced stores: `quoteText`, `authorName`, `sourceName`, `hasUserEdited` |
| `index.ts` | Barrel export for all stores |

## For AI Agents

### Working In This Directory
- `settings.ts` stores sync to URL hash as plain strings (no encoding needed)
- `quote.ts` stores sync to URL hash as **base64** — handles special characters safely
- `setSilent()` updates the store value without writing to URL hash — critical for API usage
- `hasUserEdited` prevents theme switches from overwriting user-typed quotes

### Testing Requirements
- Verify URL hash updates correctly when stores change
- Verify `setSilent()` does NOT update the URL
- Test base64 round-trip with special characters (e.g., emojis, accents)

### Common Patterns
- `createBase64HashStore()` factory for quote/author stores
- `window.location.hash` persistence for shareable links
- Separate `set()` (writes hash) and `setSilent()` (does not write hash) methods

## Dependencies

### Internal
- `$lib/themes` — `DEFAULT_QUOTE`, `DEFAULT_AUTHOR` defaults

### External
- Svelte `writable` store

<!-- MANUAL: -->
