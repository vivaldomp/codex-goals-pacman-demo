import { Direction, DIRECTION_VECTORS } from '../constants/directions';
import { TILE_SIZE } from '../constants/game';
import type { Vector2 } from '../types/vector';

export const tileToWorld = (tile: Vector2): Vector2 => ({
  x: tile.x * TILE_SIZE + TILE_SIZE / 2,
  y: tile.y * TILE_SIZE + TILE_SIZE / 2
});

export const worldToTile = (world: Vector2): Vector2 => ({
  x: Math.floor(world.x / TILE_SIZE),
  y: Math.floor(world.y / TILE_SIZE)
});

export const isTileCenter = (world: Vector2, epsilon = 0.85): boolean => {
  const center = tileToWorld(worldToTile(world));
  return Math.abs(world.x - center.x) <= epsilon && Math.abs(world.y - center.y) <= epsilon;
};

export const snapToTileCenter = (world: Vector2): Vector2 => tileToWorld(worldToTile(world));

export const nextTile = (tile: Vector2, direction: Direction): Vector2 => {
  const vector = DIRECTION_VECTORS[direction];
  return { x: tile.x + vector.x, y: tile.y + vector.y };
};

export const oppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
    case Direction.None:
      return Direction.None;
  }
};
