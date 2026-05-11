import { describe, expect, it } from 'vitest';
import { TILE_SIZE } from '../src/constants/game';
import { tileToWorld, worldToTile, isTileCenter, oppositeDirection } from '../src/maps/map-utils';
import { Direction } from '../src/constants/directions';

describe('map utilities', () => {
  it('converts tile coordinates to centered world coordinates and back', () => {
    const world = tileToWorld({ x: 13, y: 23 });

    expect(world).toEqual({ x: 13 * TILE_SIZE + TILE_SIZE / 2, y: 23 * TILE_SIZE + TILE_SIZE / 2 });
    expect(worldToTile(world)).toEqual({ x: 13, y: 23 });
    expect(isTileCenter(world)).toBe(true);
  });

  it('returns the opposite direction for arcade reversals', () => {
    expect(oppositeDirection(Direction.Left)).toBe(Direction.Right);
    expect(oppositeDirection(Direction.Up)).toBe(Direction.Down);
  });
});
