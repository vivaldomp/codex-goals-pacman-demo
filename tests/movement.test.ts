import { describe, expect, it } from 'vitest';
import { Direction } from '../src/constants/directions';
import { TileType } from '../src/constants/tiles';
import { createActor, stepActor } from '../src/systems/movement';
import { createMaze } from '../src/maps/maze';
import { tileToWorld } from '../src/maps/map-utils';

describe('grid movement', () => {
  const maze = createMaze([
    [TileType.Wall, TileType.Wall, TileType.Wall, TileType.Wall],
    [TileType.Wall, TileType.Empty, TileType.Empty, TileType.Wall],
    [TileType.Wall, TileType.Wall, TileType.Empty, TileType.Wall],
    [TileType.Wall, TileType.Wall, TileType.Wall, TileType.Wall]
  ]);

  it('honors buffered direction at tile centers', () => {
    const actor = createActor(tileToWorld({ x: 1, y: 1 }), Direction.Right, 80);
    actor.nextDirection = Direction.Down;

    const moved = stepActor(actor, maze, 0.2);

    expect(moved.direction).toBe(Direction.Right);
    expect(moved.nextDirection).toBe(Direction.Down);
  });

  it('turns when the buffered direction becomes legal', () => {
    const actor = createActor(tileToWorld({ x: 2, y: 1 }), Direction.Right, 80);
    actor.nextDirection = Direction.Down;

    const moved = stepActor(actor, maze, 1 / 60);

    expect(moved.direction).toBe(Direction.Down);
    expect(moved.nextDirection).toBe(Direction.None);
  });
});
