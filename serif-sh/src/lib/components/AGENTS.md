<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# components

## Purpose

All reusable Svelte components for the application. The centerpiece is `quote-frame.svelte` which renders the quote snapshot with 10+ distinct visual themes. Icons are extracted to dedicated Svelte components for theme-specific quote marks and brand logos.

## Key Files

| File | Description |
|------|-------------|
| `quote-frame.svelte` | Core rendering component — all theme layouts, contenteditable fields, quote marks |
| `theme-selector.svelte` | Dropdown for selecting visual themes |
| `font-selector.svelte` | Font family picker |
| `alignment-control.svelte` | Text alignment buttons |
| `padding-control.svelte` | Padding size selector |
| `toggle-control.svelte` | Generic toggle switch component |
| `export-button.svelte` | Export to PNG/SVG with client-side capture |
| `resizable-frame.svelte` | Resizable container for the quote frame |
| `toast.svelte` | Success/error notification toast |
| `about-modal.svelte` | About dialog |
| `import-modal.svelte` | Import from social media dialog |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `icons/` | SVG icon components: quote marks, brand logos, UI icons (see `icons/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `quote-frame.svelte` is the most complex file — each `theme.quoteStyle` has a completely different DOM block
- Never bind Svelte reactive stores directly inside `contenteditable` elements — use the `editableStore` action
- New themes need: new `QuoteStyle` in `themes.ts` + new conditional block in `quote-frame.svelte`

### Testing Requirements
- Visual testing: switch through all themes in the dev server
- Verify contenteditable cursor position is preserved during typing
- Check export (PNG/SVG) works across themes

### Common Patterns
- Snippets (`{#snippet}`) for reusable template blocks inside `quote-frame.svelte`
- `use:editableStore` action for two-way binding with contenteditable
- Brand themes (`vercel`, `peerlist`, `x`) enable additional toggles (logo, dark mode, verified badge)

## Dependencies

### Internal
- `$lib/stores` — all reactive state consumed by components
- `$lib/themes` — theme definitions and font registry
- `icons/` — SVG icons used by `quote-frame.svelte`

### External
- Tailwind CSS v4
- html-to-image (for client-side export)

<!-- MANUAL: -->
