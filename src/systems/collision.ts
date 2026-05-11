import { TILE_SIZE } from '../constants/game';
import type { Vector2 } from '../types/vector';

export const circlesOverlap = (a: Vector2, b: Vector2, radius = TILE_SIZE * 0.55): boolean => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy <= radius * radius;
};
