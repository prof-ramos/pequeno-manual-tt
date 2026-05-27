<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# pequeno-manual-tt

## Purpose

A dual-project repository combining a SvelteKit 5 web app (`serif-sh/`) for generating beautiful, shareable quote images with a Python automation suite (`scripts/`) that posts daily quotes from "Pequeno Manual de Instrucoes para a Vida" (1001 quotes) to X (Twitter).

## Key Files

| File | Description |
|------|-------------|
| `CLAUDE.md` | Claude Code project instructions |
| `AGENTS.md` | This file — AI agent guidance |
| `Pequeno Manual de Instrucoes para a Vida.md` | Source book with 1001 quotes |
| `package.json` | Not at root — see `serif-sh/package.json` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `serif-sh/` | SvelteKit 5 web app — quote image generator (see `serif-sh/AGENTS.md`) |
| `scripts/` | Python automation scripts — daily X posting (see `scripts/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All npm commands run from `serif-sh/`
- All Python commands run from `scripts/`
- The two projects communicate via HTTP: `scripts/daily-post.py` calls `serif-sh/src/routes/api/generate/+server.ts`

### Testing Requirements
- `cd serif-sh && npm run check` — TypeScript type-checking
- `cd scripts && python3 -m py_compile daily-post.py` — Python syntax check

### Common Patterns
- Hash-based URL state for UI sharing (base64-encoded)
- Query params for API/programmatic usage (plain text)
- `setSilent()` pattern for updating stores without polluting URL hash

## Dependencies

### Internal
- `serif-sh/` ↔ `scripts/` — HTTP API bridge for image generation

### External
- SvelteKit 5 + Svelte 5 runes + Tailwind CSS v4
- Python 3.12+ + requests + Playwright

<!-- MANUAL: -->
