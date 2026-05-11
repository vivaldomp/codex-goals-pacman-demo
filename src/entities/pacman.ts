import { Direction } from '../constants/directions';
import { BASE_PACMAN_SPEED } from '../constants/game';
import { createActor, type MovingActor } from '../systems/movement';
import type { Vector2 } from '../types/vector';

export interface Pacman extends MovingActor {
  mouthFrame: number;
  deathTimer: number;
  alive: boolean;
}

export const createPacman = (position: Vector2, level: number): Pacman => ({
  ...createActor(position, Direction.Left, BASE_PACMAN_SPEED + Math.min(level - 1, 8) * 2),
  mouthFrame: 0,
  deathTimer: 0,
  alive: true
});

export const updatePacmanAnimation = (pacman: Pacman, deltaSeconds: number): void => {
  if (!pacman.alive) {
    pacman.deathTimer += deltaSeconds;
    return;
  }
  pacman.mouthFrame = (pacman.mouthFrame + deltaSeconds * 12) % 4;
};
