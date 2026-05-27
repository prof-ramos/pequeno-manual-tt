<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-27 | Updated: 2026-05-27 -->

# scripts

## Purpose

Python automation suite for the "Conselho do Dia" (Advice of the Day) project. Generates daily quote images via the serif.sh API and posts them to X (Twitter). Supports deterministic daily selection, random quotes, and bulk preview generation.

## Key Files

| File | Description |
|------|-------------|
| `daily-post.py` | Main automation script — posts daily quote to X with generated image |
| `generate-previews.py` | Bulk image generator for previewing multiple quotes |
| `extract-conselhos.py` | Parser that regenerates `conselhos.json` from the markdown book |
| `requirements.txt` | Python dependencies: `requests` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `output/` | Generated PNG images saved here |
| `preview-images/` | Bulk preview outputs |

## For AI Agents

### Working In This Directory
- Always run inside a virtual environment: `source .venv/bin/activate`
- The script depends on a running `serif-sh` dev server (default: `http://localhost:5173`)
- Use `--test` flag to generate images without posting to X
- Use `--save-only` to skip posting entirely

### Testing Requirements
- `python3 -m py_compile daily-post.py` — syntax validation
- `python3 daily-post.py --test --quote 1` — full image generation test

### Common Patterns
- Deterministic quote selection: `((day_of_year - 1) % 1001) + 1`
- API call: `GET /api/generate?quote=&theme=&author=&source=&number=`
- OAuth 2.0 User Token with `tweet.write` scope required for posting

## Dependencies

### Internal
- `../serif-sh/src/lib/conselhos.json` — Source data: 1001 quotes
- `../serif-sh/src/routes/api/generate/+server.ts` — Image generation endpoint

### External
- `requests` — HTTP client for API calls and X API v2

<!-- MANUAL: -->
