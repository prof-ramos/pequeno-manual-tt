# serif.sh

Create beautiful, shareable images of your favorite quotes. Choose from elegant themes, customize fonts, alignment, and padding, then export as an image.

## Themes

**Brand themes** (with light/dark toggle):

| Theme | Style | Accent | Font |
|-------|-------|--------|------|
| Vercel | Brutalist | Blue | Geist |
| Peerlist | Startup | Green | Instrument Serif / Geist |
| X | Chirp | Blue | Inter |

**Standalone themes:**

| Theme | Style | Description | Font |
|-------|-------|-------------|------|
| Editorial | Editorial | Ivory background, classic feel | Playfair / Inter |
| Breeze | Breeze | Blue-to-white gradient | Old Standard TT / Inter |
| Aura | Aura | Orange-to-purple gradient | Inter |
| Paper | Paper | White paper texture background | Inter |
| Noir | Noir | Black with yellow quote marks | Playfair / Inter |
| Glass | Glass | Grey-to-black gradient | Old Standard TT / Inter |
| Claude Code | Claude Code | Terracotta monospace terminal | JetBrains Mono |

## Setup

```bash
npm install
npm run dev
```

## Tech Stack

- [SvelteKit](https://kit.svelte.dev) + Svelte 5
- [Tailwind CSS](https://tailwindcss.com) v4
- [bits-ui](https://bits-ui.com) for UI primitives
- [html-to-image](https://github.com/bubkoo/html-to-image) for image export
