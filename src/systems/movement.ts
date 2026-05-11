import { Direction, DIRECTION_VECTORS } from '../constants/directions';
import { LOGICAL_WIDTH, TILE_SIZE } from '../constants/game';
import type { Maze } from '../maps/maze';
import { isWalkableTile } from '../maps/maze';
import { isTileCenter, nextTile, snapToTileCenter, worldToTile } from '../maps/map-utils';
import type { Vector2 } from '../types/vector';

export interface MovingActor {
  position: Vector2;
  direction: Direction;
  nextDirection: Direction;
  speed: number;
}

export const createActor = (position: Vector2, direction: Direction, speed: number): MovingActor => ({
  position: { ...position },
  direction,
  nextDirection: Direction.None,
  speed
});

export const canMove = (actor: MovingActor, maze: Maze, direction: Direction): boolean => {
  if (direction === Direction.None) return false;
  return isWalkableTile(maze, nextTile(worldToTile(actor.position), direction));
};

export const stepActor = (actor: MovingActor, maze: Maze, deltaSeconds: number): MovingActor => {
  const moved: MovingActor = {
    ...actor,
    position: { ...actor.position }
  };

  if (isTileCenter(moved.position)) {
    moved.position = snapToTileCenter(moved.position);
    if (moved.nextDirection !== Direction.None && canMove(moved, maze, moved.nextDirection)) {
      moved.direction = moved.nextDirection;
      moved.nextDirection = Direction.None;
    }
    if (!canMove(moved, maze, moved.direction)) {
      moved.direction = Direction.None;
    }
  }

  const vector = DIRECTION_VECTORS[moved.direction];
  moved.position.x += vector.x * moved.speed * deltaSeconds;
  moved.position.y += vector.y * moved.speed * deltaSeconds;

  if (moved.position.x < -TILE_SIZE / 2) moved.position.x = LOGICAL_WIDTH + TILE_SIZE / 2;
  if (moved.position.x > LOGICAL_WIDTH + TILE_SIZE / 2) moved.position.x = -TILE_SIZE / 2;

  return moved;
};
