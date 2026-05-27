<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# lib

## Purpose

Core library of the application. Contains all reusable Svelte components, reactive stores, theme definitions, utility functions, and the quote data file. This is the heart of the application.

## Key Files

| File | Description |
|------|-------------|
| `themes.ts` | Theme definitions, font registry, QuoteStyle types |
| `conselhos.json` | 1001 numbered quotes from "Pequeno Manual de Instrucoes para a Vida" |
| `index.ts` | Barrel export for all $lib/ modules |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Svelte components (see `components/AGENTS.md`) |
| `stores/` | Reactive stores (see `stores/AGENTS.md`) |
| `utils/` | Utility functions (see `utils/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Always export via `index.ts` for clean imports
- Theme changes affect `quote-frame.svelte` — each `QuoteStyle` has its own DOM block
- New themes need: definition in `themes.ts` + render block in `quote-frame.svelte`

### Testing Requirements
- Type-check: `npm run check`
- Visual test: open dev server and verify all theme renders

### Common Patterns
- Svelte stores with URL hash sync for persistence
- `setSilent()` for updates that should not write to URL
- `editableStore` action for contenteditable fields (prevents cursor destruction)

## Dependencies

### Internal
- `components/quote-frame.svelte` — core rendering, depends on stores and themes
- `stores/` — all reactive state
- `utils/export.ts` — client-side image export

### External
- Tailwind CSS v4
- html-to-image

<!-- MANUAL: -->
