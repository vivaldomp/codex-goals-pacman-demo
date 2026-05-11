# 🎮 Projeto — Pac-Man Arcade com Vite + TypeScript + Canvas

Crie um jogo completo inspirado no Pac-Man clássico de arcade utilizando **Vite + TypeScript + HTML5 Canvas**, com foco em:

* fidelidade visual
* gameplay fluido
* arquitetura profissional
* performance
* experiência autêntica de arcade

---

# 🎯 Objetivo

O resultado final deve reproduzir o máximo possível da experiência do arcade original de 1980, incluindo:

* movimentação
* velocidade
* sensação de controle
* comportamento dos fantasmas
* pacing do gameplay
* estilo visual
* HUD arcade
* efeitos sonoros
* progressão de dificuldade

Referência:

* Pac-Man

---

# 🛠 Stack Técnica

## Tecnologias obrigatórias

* Vite
* TypeScript
* HTML5 Canvas API
* CSS puro

## Restrições

Não utilizar:

* Phaser
* PixiJS
* Three.js
* engines externas

---

# 🧱 Estrutura do Projeto

Organizar o projeto em módulos bem definidos:

```text
/src
  /core
  /entities
  /systems
  /maps
  /rendering
  /audio
  /ui
  /input
  /ai
  /utils
  /constants
  /debug
  /assets
```

---

# 🧩 Arquitetura

## Requisitos arquiteturais

* arquitetura orientada a componentes
* game loop desacoplado
* modularização forte
* separação clara de responsabilidades
* tipagem forte com TypeScript
* código limpo e comentado
* pronto para expansão

---

# 🎮 Gameplay

## Funcionalidades principais

Implementar:

* labirinto azul clássico
* pellets pequenos
* power pellets
* frutas bônus
* teletransporte lateral
* sistema de vidas
* pontuação
* high score
* progressão de níveis
* dificuldade crescente
* pause
* tela de start
* tela de game over
* transições entre níveis

---

# 🟡 Pacman

## Requisitos

Implementar:

* movimentação grid-based
* buffer de direção igual ao arcade
* interpolação suave
* animação de boca abrindo/fechando
* animação de morte clássica
* velocidades ajustáveis por nível

---

# 👻 Fantasmas

## Fantasmas obrigatórios

* Blinky
* Pinky
* Inky
* Clyde

## IA dos fantasmas

Cada fantasma deve possuir:

* comportamento distinto
* target tile próprio
* lógica de perseguição inspirada no arcade

## Estados obrigatórios

* scatter
* chase
* frightened
* eaten

## Sistema de IA

Implementar:

* máquina de estados
* timers automáticos
* alternância chase/scatter
* frightened mode temporário
* IA baseada em target tiles
* pathfinding simplificado estilo arcade

---

# ⚙ Física e Colisão

Implementar:

* colisão híbrida grid/pixel
* snapping correto em tiles
* movimentação sem jitter
* sistema determinístico

---

# 🖥 Sistema de Renderização

## Canvas

* responsivo
* pixel perfect
* retro rendering
* integer scaling
* sem blur

## Configuração obrigatória

```ts
ctx.imageSmoothingEnabled = false;
```

## CSS obrigatório

```css
canvas {
  image-rendering: pixelated;
}
```

---

# 🎨 Assets — Bitmap Obrigatório

## ❌ NÃO utilizar SVG

Todos os assets devem ser:

* PNG
* bitmap raster
* pixel art

## ❌ Proibido

Não utilizar:

* SVG
* vetores
* renderização vetorial procedural
* pintura digital moderna
* assets 3D
* ilustração realista

---

# 🤖 Pipeline de Assets com IA

## Estrutura

```text
/assets
  /raw-ai
  /sprites
  /tilesets
  /ui
  /audio
```

## Objetivo

Criar pipeline automatizado para geração de assets bitmap usando image generation.

---

# 🕹 Estilo Visual

## Direção artística

Visual inspirado em arcade clássico:

* pixel art retrô 8-bit/16-bit
* paleta limitada
* pixels limpos
* sem antialiasing
* aparência CRT opcional

---

# 🧍 Sprites Obrigatórios

## Pacman

* idle
* movimento
* abertura/fechamento da boca
* animação de morte
* direções

## Fantasmas

* animações direcionais
* frightened mode
* frightened blinking
* eyes-only mode

## Objetos

* pellets
* power pellets
* frutas bônus

## Maze Tiles

* paredes
* curvas
* cantos
* portas
* túneis

## UI

* fonte bitmap arcade
* números bitmap
* ícones bitmap

---

# 🧠 Prompts para Image Generation

Todos os prompts devem conter:

* “pixel art”
* “bitmap sprite”
* “retro arcade”
* “transparent background”
* “sprite sheet”
* “16x16 grid”
* “no antialiasing”

## Evitar

* SVG
* vector art
* digital painting
* realistic
* 3D
* modern illustration

---

# 🖼 Exemplo de Prompt

```text
Retro arcade pixel art bitmap sprite sheet of a yellow maze character with opening mouth animation, 16x16 grid, transparent background, classic 1980 arcade style, clean pixels, no antialiasing.
```

---

# 📦 Spritesheets

Criar spritesheets otimizados para:

* pacman
* ghosts
* frightened ghosts
* ghost eyes
* pellets
* fruits
* maze
* HUD

---

# 🏗 Build Pipeline de Assets

## Adicionar

* packing automático
* atlas generation
* metadata JSON
* PNG optimization
* cache busting

## Scripts

```bash
npm run pack-sprites
npm run optimize-assets
```

---

# 🔊 Áudio

## AudioManager

Implementar AudioManager centralizado.

## Sons obrigatórios

* início do jogo
* pellet
* power pellet
* comer fantasma
* morte
* intermission
* vitória de nível

---

# 🗺 Sistema de Mapas

## Estrutura do mapa

Criar mapa usando matriz numérica:

```ts
const map = [
  [1,1,1,1],
  [1,0,0,1]
];
```

## Separação de responsabilidades

Separar:

* renderer
* colisão
* definição lógica

## Utilitários

Criar conversores:

* tile → world
* world → tile

---

# 🧾 HUD Arcade

## Exibir

* score
* high score
* vidas
* nível

## Visual

* estilo arcade retrô
* bitmap font

---

# ✨ Extras

Implementar:

* partículas simples
* scanlines opcionais
* efeito CRT opcional
* suporte a gamepad
* modo debug

## Debug

Exibir:

* hitboxes
* paths
* target tiles
* FPS counter

---

# 🚀 Performance

## Objetivos

* 60 FPS
* baixo uso de memória
* evitar garbage collection excessivo

## Técnicas

Aplicar:

* object pooling
* caching
* sprite batching simples

---

# 💾 Persistência

Salvar usando LocalStorage:

* high score
* configurações
* volume
* controles

---

# ✅ Qualidade do Código

## Obrigatório

* código limpo
* sem arquivos gigantes
* sem placeholders
* tipagem forte
* comentários úteis
* responsabilidades bem separadas

## Extrair para módulos dedicados

* constantes mágicas
* enums
* configs
* tipos

---

# 📦 Entregáveis

Gerar:

1. Estrutura completa do projeto
2. Todos os arquivos TypeScript
3. Configuração do Vite
4. Engine do jogo
5. Game loop completo
6. Sistema de renderização
7. Sistema de áudio
8. Sistema de IA
9. Assets bitmap
10. Spritesheets
11. Scripts de build
12. README completo
13. Instruções de execução

---

# 📜 Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run pack-sprites
npm run optimize-assets
```

---

# 🏁 Resultado Esperado

O jogo final deve parecer um verdadeiro jogo de arcade clássico:

* gameplay autêntico
* sensação retrô
* pixel art fiel
* animações suaves
* IA convincente
* áudio arcade
* performance fluida

O resultado deve possuir qualidade suficiente para parecer um remake profissional moderno do Pac-Man clássico utilizando apenas:

* Vite
* TypeScript
* Canvas API
* assets bitmap rasterizados