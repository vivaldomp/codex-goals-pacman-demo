# Pac-Man Arcade Canvas

Um remake em Vite + TypeScript + HTML5 Canvas inspirado no Pac-Man arcade de 1980, criado com CSS puro e bitmap PNG sprites gerados.

## Executar

```bash
npm install
npm run pack-sprites
npm run optimize-assets
npm run dev
```

Abra a URL do Vite exibida pelo dev server. Os controles são as setas do teclado, `Enter` ou `Space` para iniciar, `P` para pausar e `F3` para debug overlays. Gamepad com left stick, start e select/back também é suportado.

## Build e Verificação

```bash
npm test
npm run build
npm run preview
```

Comandos da asset pipeline:

```bash
npm run pack-sprites
npm run optimize-assets
```

## Arquitetura

A implementação é dividida em módulos focados dentro de `src/`:

- `core`: fixed timestep loop e orquestração do jogo
- `entities`: Pacman, ghosts, pellets, fruit
- `systems`: movimento determinístico, scoring, collision, particles
- `maps`: matriz numérica de tiles, collision helpers, conversão tile/world
- `rendering`: Canvas renderer e PNG spritesheet loader
- `audio`: sound effects centralizados com Web Audio
- `input`: input de keyboard e gamepad
- `ai`: ghost state machine e lógica de target-tile
- `ui`, `utils`, `constants`, `debug`, `assets`: screen state, persistência, configuração, overlays, asset boundary

## Gameplay Features

O jogo inclui o clássico labirinto azul, pellets, power pellets, fruit, side tunnels, lives, score, local high score, progressão de level, velocidade crescente, pause, telas de start/game-over, transições de level, direction buffering do Pacman, movimento suave por tile, modos scatter/chase/frightened/eaten dos ghosts, comportamento target-tile dos ghosts, debug de hitboxes/targets/FPS, particles simples, estilo CRT scanline e tons de áudio arcade gerados.

## Bitmap Assets

Nenhum SVG asset é usado. `scripts/pack-sprites.mjs` gera raster PNG sprite sheets para Pacman, ghosts, frightened ghosts, eyes, pellets, fruits, maze tiles e HUD icons. Ele também escreve `assets/raw-ai/prompts.json` com prompts contendo os termos obrigatórios:

`pixel art`, `bitmap sprite`, `retro arcade`, `transparent background`, `sprite sheet`, `16x16 grid`, and `no antialiasing`.

`scripts/optimize-assets.mjs` copia os bitmap assets gerados para `public/assets` e escreve um cache-busting manifest.
