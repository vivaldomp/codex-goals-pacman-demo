import { Direction } from '../constants/directions';
import { BASE_GHOST_SPEED } from '../constants/game';
import { GhostName, createGhostBrain, type GhostBrain } from '../ai/ghost-ai';
import { createActor, type MovingActor } from '../systems/movement';
import type { Vector2 } from '../types/vector';

export interface Ghost extends MovingActor {
  name: GhostName;
  color: string;
  scatterTarget: Vector2;
  home: Vector2;
  brain: GhostBrain;
  released: boolean;
}

const COLORS: Record<GhostName, string> = {
  [GhostName.Blinky]: '#ff2a2a',
  [GhostName.Pinky]: '#ffb8de',
  [GhostName.Inky]: '#00f6ff',
  [GhostName.Clyde]: '#ffb84a'
};

const SCATTER: Record<GhostName, Vector2> = {
  [GhostName.Blinky]: { x: 26, y: 1 },
  [GhostName.Pinky]: { x: 1, y: 1 },
  [GhostName.Inky]: { x: 26, y: 29 },
  [GhostName.Clyde]: { x: 1, y: 29 }
};

export const createGhost = (name: GhostName, position: Vector2, level: number): Ghost => ({
  ...createActor(position, Direction.Left, BASE_GHOST_SPEED + Math.min(level - 1, 10) * 2),
  name,
  color: COLORS[name],
  scatterTarget: SCATTER[name],
  home: { ...position },
  brain: createGhostBrain(),
  released: name === GhostName.Blinky
});
