# Pac-Man Arcade Canvas

A Vite + TypeScript + HTML5 Canvas remake inspired by the 1980 arcade Pac-Man, built with pure CSS and generated bitmap PNG sprites.

## Run

```bash
npm install
npm run pack-sprites
npm run optimize-assets
npm run dev
```

Open the Vite URL printed by the dev server. Controls are arrow keys, `Enter` or `Space` to start, `P` to pause, and `F3` for debug overlays. Gamepad left stick, start, and select/back are also supported.

## Build And Verify

```bash
npm test
npm run build
npm run preview
```

Asset pipeline commands:

```bash
npm run pack-sprites
npm run optimize-assets
```

## Architecture

The implementation is split into focused modules under `src/`:

- `core`: fixed timestep loop and game orchestration
- `entities`: Pacman, ghosts, pellets, fruit
- `systems`: deterministic movement, scoring, collision, particles
- `maps`: numeric tile matrix, collision helpers, tile/world conversion
- `rendering`: Canvas renderer and PNG spritesheet loader
- `audio`: centralized Web Audio sound effects
- `input`: keyboard and gamepad input
- `ai`: ghost state machine and target-tile logic
- `ui`, `utils`, `constants`, `debug`, `assets`: screen state, persistence, configuration, overlays, asset boundary

## Gameplay Features

The game includes a classic blue maze, pellets, power pellets, fruit, side tunnels, lives, score, local high score, level progression, increasing speed, pause, start/game-over screens, level transitions, Pacman direction buffering, smooth tile movement, ghost scatter/chase/frightened/eaten modes, target-tile ghost behavior, debug hitboxes/targets/FPS, simple particles, CRT scanline styling, and generated arcade audio tones.

## Bitmap Assets

No SVG assets are used. `scripts/pack-sprites.mjs` generates raster PNG sprite sheets for Pacman, ghosts, frightened ghosts, eyes, pellets, fruits, maze tiles, and HUD icons. It also writes `assets/raw-ai/prompts.json` with prompts containing the required terms:

`pixel art`, `bitmap sprite`, `retro arcade`, `transparent background`, `sprite sheet`, `16x16 grid`, and `no antialiasing`.

`scripts/optimize-assets.mjs` copies the generated bitmap assets to `public/assets` and writes a cache-busting manifest.
