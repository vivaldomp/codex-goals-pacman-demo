import { Direction } from '../constants/directions';
import { HUD_HEIGHT, LOGICAL_HEIGHT, LOGICAL_WIDTH, TILE_SIZE } from '../constants/game';
import { TileType } from '../constants/tiles';
import type { Ghost } from '../entities/ghost';
import type { Pacman } from '../entities/pacman';
import type { Fruit } from '../entities/fruit';
import type { Maze } from '../maps/maze';
import { getTile } from '../maps/maze';
import { tileToWorld, worldToTile } from '../maps/map-utils';
import type { Particle } from '../systems/particles';
import type { DebugState } from '../debug/debug-overlay';
import { drawFrame, loadSpriteSheet, type SpriteSheet } from './sprite-loader';

export interface RenderModel {
  maze: Maze;
  pacman: Pacman;
  ghosts: Ghost[];
  fruit: Fruit;
  particles: readonly Particle[];
  score: number;
  highScore: number;
  lives: number;
  level: number;
  screen: 'start' | 'playing' | 'paused' | 'level-clear' | 'game-over';
  debug: DebugState;
}

export class CanvasRenderer {
  private readonly sheets: Record<string, SpriteSheet>;

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas.width = LOGICAL_WIDTH;
    this.canvas.height = LOGICAL_HEIGHT;
    const context = this.context();
    context.imageSmoothingEnabled = false;
    this.sheets = {
      pacman: loadSpriteSheet('/assets/sprites/pacman.png'),
      ghosts: loadSpriteSheet('/assets/sprites/ghosts.png'),
      frightened: loadSpriteSheet('/assets/sprites/frightened.png'),
      eyes: loadSpriteSheet('/assets/sprites/eyes.png'),
      pellets: loadSpriteSheet('/assets/sprites/pellets.png'),
      fruits: loadSpriteSheet('/assets/sprites/fruits.png'),
      maze: loadSpriteSheet('/assets/tilesets/maze.png'),
      hud: loadSpriteSheet('/assets/ui/hud.png')
    };
  }

  render(model: RenderModel): void {
    const context = this.context();
    context.imageSmoothingEnabled = false;
    context.fillStyle = '#000';
    context.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    this.drawHud(context, model);
    context.save();
    context.translate(0, HUD_HEIGHT);
    this.drawMaze(context, model.maze);
    this.drawFruit(context, model.fruit);
    this.drawPacman(context, model.pacman);
    for (const ghost of model.ghosts) this.drawGhost(context, ghost);
    this.drawParticles(context, model.particles);
    if (model.debug.enabled) this.drawDebug(context, model);
    context.restore();
    if (model.screen !== 'playing') this.drawOverlay(context, model.screen);
  }

  private context(): CanvasRenderingContext2D {
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context is unavailable.');
    return context;
  }

  private drawHud(context: CanvasRenderingContext2D, model: RenderModel): void {
    context.fillStyle = '#fff';
    context.font = '8px "Courier New", monospace';
    context.textBaseline = 'top';
    context.fillText('1UP', 32, 8);
    context.fillText(model.score.toString().padStart(6, '0'), 32, 22);
    context.fillText('HIGH SCORE', 164, 8);
    context.fillText(model.highScore.toString().padStart(6, '0'), 188, 22);
    context.fillText(`LEVEL ${model.level}`, 340, 22);
    for (let life = 0; life < model.lives - 1; life += 1) {
      drawFrame(context, this.sheets.hud, 0, 24 + life * 18, 54);
    }
  }

  private drawMaze(context: CanvasRenderingContext2D, maze: Maze): void {
    for (let y = 0; y < maze.height; y += 1) {
      for (let x = 0; x < maze.width; x += 1) {
        const tile = getTile(maze, { x, y });
        if (tile === TileType.Wall) drawFrame(context, this.sheets.maze, 0, x * TILE_SIZE, y * TILE_SIZE);
        if (tile === TileType.Door) drawFrame(context, this.sheets.maze, 1, x * TILE_SIZE, y * TILE_SIZE);
        if (tile === TileType.Pellet) drawFrame(context, this.sheets.pellets, 0, x * TILE_SIZE, y * TILE_SIZE);
        if (tile === TileType.PowerPellet) drawFrame(context, this.sheets.pellets, 1, x * TILE_SIZE, y * TILE_SIZE);
      }
    }
  }

  private drawPacman(context: CanvasRenderingContext2D, pacman: Pacman): void {
    let directionOffset = 0;
    if (pacman.direction === Direction.Left) directionOffset = 4;
    if (pacman.direction === Direction.Up) directionOffset = 8;
    if (pacman.direction === Direction.Down) directionOffset = 12;
    const frame = pacman.alive ? directionOffset + Math.floor(pacman.mouthFrame) : 16 + Math.min(7, Math.floor(pacman.deathTimer * 12));
    drawFrame(context, this.sheets.pacman, frame, pacman.position.x - 8, pacman.position.y - 8);
  }

  private drawGhost(context: CanvasRenderingContext2D, ghost: Ghost): void {
    if (ghost.brain.mode === 'frightened') {
      const blinking = ghost.brain.frightenedTimer < 2 && Math.floor(ghost.brain.frightenedTimer * 8) % 2 === 0;
      drawFrame(context, this.sheets.frightened, blinking ? 1 : 0, ghost.position.x - 8, ghost.position.y - 8);
      return;
    }
    if (ghost.brain.mode === 'eaten') {
      drawFrame(context, this.sheets.eyes, 0, ghost.position.x - 8, ghost.position.y - 8);
      return;
    }
    const base = ['blinky', 'pinky', 'inky', 'clyde'].indexOf(ghost.name);
    drawFrame(context, this.sheets.ghosts, Math.max(0, base), ghost.position.x - 8, ghost.position.y - 8);
  }

  private drawFruit(context: CanvasRenderingContext2D, fruit: Fruit): void {
    if (!fruit.visible) return;
    const world = tileToWorld(fruit.tile);
    drawFrame(context, this.sheets.fruits, 0, world.x - 8, world.y - 8);
  }

  private drawParticles(context: CanvasRenderingContext2D, particles: readonly Particle[]): void {
    for (const particle of particles) {
      context.fillStyle = particle.color;
      context.fillRect(Math.round(particle.position.x), Math.round(particle.position.y), 2, 2);
    }
  }

  private drawDebug(context: CanvasRenderingContext2D, model: RenderModel): void {
    context.strokeStyle = '#20ff6b';
    context.lineWidth = 1;
    for (const ghost of model.ghosts) {
      const tile = worldToTile(ghost.position);
      context.strokeRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      const target = ghost.brain.mode === 'scatter' ? ghost.scatterTarget : tile;
      context.strokeRect(target.x * TILE_SIZE + 3, target.y * TILE_SIZE + 3, 10, 10);
    }
    context.fillStyle = '#20ff6b';
    context.fillText(`${model.debug.fps} FPS`, 6, 6);
  }

  private drawOverlay(context: CanvasRenderingContext2D, screen: RenderModel['screen']): void {
    const labels = {
      start: 'PRESS START',
      paused: 'PAUSED',
      'level-clear': 'READY',
      'game-over': 'GAME OVER',
      playing: ''
    };
    context.fillStyle = 'rgba(0, 0, 0, 0.72)';
    context.fillRect(0, HUD_HEIGHT, LOGICAL_WIDTH, LOGICAL_HEIGHT - HUD_HEIGHT);
    context.fillStyle = screen === 'game-over' ? '#ff2a2a' : '#ffd800';
    context.font = '16px "Courier New", monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(labels[screen], LOGICAL_WIDTH / 2, HUD_HEIGHT + 236);
    context.textAlign = 'start';
  }
}
