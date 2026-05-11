import { Direction } from '../constants/directions';
import { HUD_HEIGHT, START_LIVES, TILE_SIZE } from '../constants/game';
import { GhostName, chooseGhostDirection, getGhostTarget } from '../ai/ghost-ai';
import { AudioManager } from '../audio/audio-manager';
import { FpsCounter } from '../debug/debug-overlay';
import { createFruit, revealFruit, updateFruit, type Fruit } from '../entities/fruit';
import { createGhost, type Ghost } from '../entities/ghost';
import { createPacman, updatePacmanAnimation, type Pacman } from '../entities/pacman';
import { eatPelletAt } from '../entities/pellet';
import type { InputManager } from '../input/input-manager';
import { cloneMaze, createClassicMaze, type Maze } from '../maps/maze';
import { tileToWorld, worldToTile } from '../maps/map-utils';
import { CanvasRenderer } from '../rendering/canvas-renderer';
import { circlesOverlap } from '../systems/collision';
import { stepActor } from '../systems/movement';
import { ParticlePool } from '../systems/particles';
import { createScoreSystem, type ScoreSystem } from '../systems/score';
import type { ScreenState } from '../ui/screen-state';

export class Game {
  private maze: Maze;
  private baseMaze: Maze;
  private pacman: Pacman;
  private ghosts: Ghost[];
  private fruit: Fruit;
  private readonly particles = new ParticlePool();
  private readonly score: ScoreSystem;
  private readonly audio: AudioManager;
  private readonly fps = new FpsCounter();
  private screen: ScreenState = 'start';
  private lives = START_LIVES;
  private level = 1;
  private levelTransition = 0;
  private debugEnabled = false;

  constructor(private renderer: CanvasRenderer, private input: InputManager) {
    this.score = createScoreSystem();
    this.audio = new AudioManager(this.score.settings.volume, this.score.settings.muted);
    this.baseMaze = createClassicMaze();
    this.maze = cloneMaze(this.baseMaze);
    this.pacman = createPacman(tileToWorld({ x: 13, y: 23 }), this.level);
    this.ghosts = this.createGhosts();
    this.fruit = createFruit(this.level);
  }

  update(deltaSeconds: number): void {
    this.fps.update(deltaSeconds);
    const input = this.input.consume();
    if (input.debugPressed) this.debugEnabled = !this.debugEnabled;
    if (input.pausePressed && this.screen === 'playing') this.screen = 'paused';
    else if (input.pausePressed && this.screen === 'paused') this.screen = 'playing';
    if (input.startPressed && (this.screen === 'start' || this.screen === 'game-over')) this.startGame();
    if (this.screen === 'paused' || this.screen === 'start' || this.screen === 'game-over') return;

    if (this.screen === 'level-clear') {
      this.levelTransition -= deltaSeconds;
      if (this.levelTransition <= 0) this.nextLevel();
      return;
    }

    if (input.direction !== Direction.None) this.pacman.nextDirection = input.direction;
    this.pacman = { ...this.pacman, ...stepActor(this.pacman, this.maze, deltaSeconds) };
    updatePacmanAnimation(this.pacman, deltaSeconds);
    this.consumePellets();
    this.updateGhosts(deltaSeconds);
    this.updateCollisions();
    updateFruit(this.fruit, deltaSeconds);
    this.particles.update(deltaSeconds);
    if (this.maze.pelletCount === 0) {
      this.audio.play('level');
      this.screen = 'level-clear';
      this.levelTransition = 2;
    }
  }

  render(): void {
    this.renderer.render({
      maze: this.maze,
      pacman: this.pacman,
      ghosts: this.ghosts,
      fruit: this.fruit,
      particles: this.particles.all(),
      score: this.score.score,
      highScore: this.score.highScore,
      lives: this.lives,
      level: this.level,
      screen: this.screen,
      debug: { enabled: this.debugEnabled, fps: this.fps.fps }
    });
  }

  private startGame(): void {
    this.score.reset();
    this.lives = START_LIVES;
    this.level = 1;
    this.audio.play('start');
    this.resetLevel();
    this.screen = 'playing';
  }

  private nextLevel(): void {
    this.level += 1;
    this.resetLevel();
    this.screen = 'playing';
    this.audio.play('intermission');
  }

  private resetLevel(): void {
    this.baseMaze = createClassicMaze();
    this.maze = cloneMaze(this.baseMaze);
    this.pacman = createPacman(tileToWorld({ x: 13, y: 23 }), this.level);
    this.ghosts = this.createGhosts();
    this.fruit = createFruit(this.level);
  }

  private createGhosts(): Ghost[] {
    return [
      createGhost(GhostName.Blinky, tileToWorld({ x: 13, y: 11 }), this.level),
      createGhost(GhostName.Pinky, tileToWorld({ x: 14, y: 14 }), this.level),
      createGhost(GhostName.Inky, tileToWorld({ x: 12, y: 14 }), this.level),
      createGhost(GhostName.Clyde, tileToWorld({ x: 15, y: 14 }), this.level)
    ];
  }

  private consumePellets(): void {
    const tile = worldToTile(this.pacman.position);
    const pellet = eatPelletAt(this.maze, tile);
    if (pellet === 'none') return;
    this.score.add(pellet === 'power' ? 50 : 10);
    this.audio.play(pellet === 'power' ? 'power' : 'pellet');
    if (pellet === 'power') {
      for (const ghost of this.ghosts) ghost.brain.frighten();
      this.particles.spawn({ x: this.pacman.position.x, y: this.pacman.position.y + HUD_HEIGHT }, '#335dff');
    }
    if (this.maze.pelletCount === 160) revealFruit(this.fruit);
  }

  private updateGhosts(deltaSeconds: number): void {
    const pacmanTile = worldToTile(this.pacman.position);
    const blinkyTile = worldToTile(this.ghosts[0].position);
    for (const ghost of this.ghosts) {
      ghost.brain.update(deltaSeconds);
      const ghostTile = worldToTile(ghost.position);
      if (ghost.brain.mode === 'eaten' && circlesOverlap(ghost.position, ghost.home, TILE_SIZE)) {
        ghost.brain.mode = 'chase';
      }
      const target = ghost.brain.mode === 'scatter'
        ? ghost.scatterTarget
        : ghost.brain.mode === 'eaten'
          ? worldToTile(ghost.home)
          : getGhostTarget(ghost.name, { tile: pacmanTile, direction: this.pacman.direction }, { tile: blinkyTile });
      ghost.nextDirection = chooseGhostDirection(this.maze, ghostTile, ghost.direction, target, ghost.brain.mode === 'frightened');
      const moved = stepActor(ghost, this.maze, deltaSeconds);
      ghost.position = moved.position;
      ghost.direction = moved.direction;
      ghost.nextDirection = moved.nextDirection;
    }
  }

  private updateCollisions(): void {
    const fruitWorld = tileToWorld(this.fruit.tile);
    if (this.fruit.visible && circlesOverlap(this.pacman.position, fruitWorld, TILE_SIZE)) {
      this.score.add(this.fruit.value);
      this.fruit.visible = false;
      this.particles.spawn({ x: fruitWorld.x, y: fruitWorld.y + HUD_HEIGHT }, '#ff2a2a');
    }

    for (const ghost of this.ghosts) {
      if (!circlesOverlap(this.pacman.position, ghost.position, TILE_SIZE * 0.7)) continue;
      if (ghost.brain.mode === 'frightened') {
        ghost.brain.mode = 'eaten';
        this.score.add(200);
        this.audio.play('ghost');
        this.particles.spawn({ x: ghost.position.x, y: ghost.position.y + HUD_HEIGHT }, '#fff');
        continue;
      }
      if (ghost.brain.mode !== 'eaten') this.killPacman();
    }
  }

  private killPacman(): void {
    this.audio.play('death');
    this.lives -= 1;
    this.score.save();
    if (this.lives <= 0) {
      this.screen = 'game-over';
      return;
    }
    this.pacman = createPacman(tileToWorld({ x: 13, y: 23 }), this.level);
    this.ghosts = this.createGhosts();
  }
}
