import { Direction, DIRECTIONS } from '../constants/directions';
import { POWER_DURATION } from '../constants/game';
import type { Maze } from '../maps/maze';
import { isWalkableTile } from '../maps/maze';
import { nextTile, oppositeDirection } from '../maps/map-utils';
import { distanceSquared, type Vector2 } from '../types/vector';

export enum GhostName {
  Blinky = 'blinky',
  Pinky = 'pinky',
  Inky = 'inky',
  Clyde = 'clyde'
}

export type GhostMode = 'scatter' | 'chase' | 'frightened' | 'eaten';

export interface GhostBrain {
  mode: GhostMode;
  frightenedTimer: number;
  phaseTimer: number;
  phaseIndex: number;
  update(deltaSeconds: number): void;
  frighten(): void;
}

const PHASES: Array<{ mode: GhostMode; seconds: number }> = [
  { mode: 'scatter', seconds: 7 },
  { mode: 'chase', seconds: 20 },
  { mode: 'scatter', seconds: 7 },
  { mode: 'chase', seconds: 20 },
  { mode: 'scatter', seconds: 5 },
  { mode: 'chase', seconds: Number.POSITIVE_INFINITY }
];

export const createGhostBrain = (): GhostBrain => ({
  mode: 'scatter',
  frightenedTimer: 0,
  phaseTimer: 0,
  phaseIndex: 0,
  update(deltaSeconds: number) {
    if (this.mode === 'frightened') {
      this.frightenedTimer -= deltaSeconds;
      if (this.frightenedTimer <= 0) {
        this.mode = PHASES[this.phaseIndex].mode;
      }
      return;
    }
    if (this.mode === 'eaten') return;
    this.phaseTimer += deltaSeconds;
    const phase = PHASES[this.phaseIndex];
    if (this.phaseTimer > phase.seconds) {
      this.phaseTimer = 0;
      this.phaseIndex = Math.min(this.phaseIndex + 1, PHASES.length - 1);
      this.mode = PHASES[this.phaseIndex].mode;
    }
  },
  frighten() {
    this.mode = 'frightened';
    this.frightenedTimer = POWER_DURATION;
  }
});

const ahead = (tile: Vector2, direction: Direction, amount: number): Vector2 => {
  let target = { ...tile };
  for (let index = 0; index < amount; index += 1) target = nextTile(target, direction);
  return target;
};

export const getGhostTarget = (
  name: GhostName,
  pacman: { tile: Vector2; direction: Direction },
  blinky: { tile: Vector2 }
): Vector2 => {
  switch (name) {
    case GhostName.Blinky:
      return { ...pacman.tile };
    case GhostName.Pinky:
      return ahead(pacman.tile, pacman.direction, 4);
    case GhostName.Inky: {
      const pivot = ahead(pacman.tile, pacman.direction, 2);
      return { x: pivot.x * 2 - blinky.tile.x, y: pivot.y * 2 - blinky.tile.y };
    }
    case GhostName.Clyde:
      return distanceSquared(pacman.tile, blinky.tile) > 64 ? { ...pacman.tile } : { x: 1, y: 29 };
  }
};

export const chooseGhostDirection = (
  maze: Maze,
  tile: Vector2,
  currentDirection: Direction,
  target: Vector2,
  allowReverse: boolean
): Direction => {
  let best = currentDirection;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const direction of DIRECTIONS) {
    if (!allowReverse && direction === oppositeDirection(currentDirection)) continue;
    const candidate = nextTile(tile, direction);
    if (!isWalkableTile(maze, candidate)) continue;
    const score = distanceSquared(candidate, target);
    if (score < bestDistance) {
      bestDistance = score;
      best = direction;
    }
  }
  return best;
};
