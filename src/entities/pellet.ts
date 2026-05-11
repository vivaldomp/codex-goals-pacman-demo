import { TileType } from '../constants/tiles';
import { getTile, setTile, type Maze } from '../maps/maze';
import type { Vector2 } from '../types/vector';

export type PelletEatResult = 'none' | 'pellet' | 'power';

export const eatPelletAt = (maze: Maze, tile: Vector2): PelletEatResult => {
  const type = getTile(maze, tile);
  if (type === TileType.Pellet) {
    setTile(maze, tile, TileType.Empty);
    return 'pellet';
  }
  if (type === TileType.PowerPellet) {
    setTile(maze, tile, TileType.Empty);
    return 'power';
  }
  return 'none';
};
