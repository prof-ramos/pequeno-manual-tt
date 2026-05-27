<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# icons

## Purpose

SVG icon components for the application. Separated into UI icons (alignment, export, toast, etc.) and theme-specific quote marks (brutalist, chirp, editorial, etc.). Also includes brand logos (Vercel, Peerlist, X).

## Key Files

| File | Description |
|------|-------------|
| `quote-editorial.svelte` | Default quote mark (used by noir, editorial, breeze themes) |
| `quote-breeze.svelte` | Quote mark for breeze/aura/glass/paper themes |
| `quote-brutalist.svelte` | Quote mark for brutalist theme |
| `quote-chirp.svelte` | Quote mark for chirp theme |
| `quote-startup.svelte` | Quote mark for startup theme |
| `quote-claude.svelte` | Quote mark for claude-code theme |
| `x-verified-badge.svelte` | X verified checkmark badge |
| `vercel-wordmark.svelte` | Vercel logo for brand themes |
| `peerlist-wordmark.svelte` | Peerlist logo for brand themes |
| `x-logo-mark.svelte` | X logo for brand themes |

## For AI Agents

### Working In This Directory
- Each icon is a standalone Svelte component accepting `color` and `size` props
- Quote mark icons are selected by `theme.quoteStyle` in `quote-frame.svelte`
- Adding a new theme style may require a new quote mark icon here

### Common Patterns
- SVG components with configurable `color` and `size` via props
- Icons are rendered via `{@render quoteIcon('style-name')}` in `quote-frame.svelte`

<!-- MANUAL: -->
