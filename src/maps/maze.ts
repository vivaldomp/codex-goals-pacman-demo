import { MAZE_COLUMNS, MAZE_ROWS } from '../constants/game';
import { TileType } from '../constants/tiles';
import type { Vector2 } from '../types/vector';

export interface Maze {
  width: number;
  height: number;
  tiles: TileType[][];
  pelletCount: number;
}

export const createMaze = (tiles: TileType[][]): Maze => ({
  width: tiles[0]?.length ?? 0,
  height: tiles.length,
  tiles: tiles.map((row) => [...row]),
  pelletCount: tiles.flat().filter((tile) => tile === TileType.Pellet || tile === TileType.PowerPellet).length
});

export const getTile = (maze: Maze, tile: Vector2): TileType => {
  const x = ((tile.x % maze.width) + maze.width) % maze.width;
  if (tile.y < 0 || tile.y >= maze.height) return TileType.Wall;
  return maze.tiles[tile.y]?.[x] ?? TileType.Wall;
};

export const setTile = (maze: Maze, tile: Vector2, type: TileType): void => {
  if (tile.y < 0 || tile.y >= maze.height) return;
  const x = ((tile.x % maze.width) + maze.width) % maze.width;
  const previous = maze.tiles[tile.y]?.[x];
  if ((previous === TileType.Pellet || previous === TileType.PowerPellet) && type === TileType.Empty) {
    maze.pelletCount = Math.max(0, maze.pelletCount - 1);
  }
  maze.tiles[tile.y][x] = type;
};

export const isWalkableTile = (maze: Maze, tile: Vector2): boolean => {
  const type = getTile(maze, tile);
  return type !== TileType.Wall && type !== TileType.Door;
};

export const cloneMaze = (maze: Maze): Maze => createMaze(maze.tiles);

const row = (source: string): TileType[] =>
  source.split('').map((char) => {
    switch (char) {
      case '#':
        return TileType.Wall;
      case '.':
        return TileType.Pellet;
      case 'o':
        return TileType.PowerPellet;
      case '=':
        return TileType.Door;
      case 't':
        return TileType.Tunnel;
      default:
        return TileType.Empty;
    }
  });

const CLASSIC_LAYOUT = [
  '############################',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#o####.#####.##.#####.####o#',
  '#.####.#####.##.#####.####.#',
  '#..........................#',
  '#.####.##.########.##.####.#',
  '#.####.##.########.##.####.#',
  '#......##....##....##......#',
  '######.##### ## #####.######',
  '     #.##### ## #####.#     ',
  '     #.##          ##.#     ',
  '     #.## ###==### ##.#     ',
  '######.## #      # ##.######',
  'tt    .   #      #   .    tt',
  '######.## #      # ##.######',
  '     #.## ######## ##.#     ',
  '     #.##          ##.#     ',
  '     #.## ######## ##.#     ',
  '######.## ######## ##.######',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#.####.#####.##.#####.####.#',
  '#o..##.......  .......##..o#',
  '###.##.##.########.##.##.###',
  '###.##.##.########.##.##.###',
  '#......##....##....##......#',
  '#.##########.##.##########.#',
  '#.##########.##.##########.#',
  '#..........................#',
  '############################'
];

export const createClassicMaze = (): Maze => {
  const tiles = CLASSIC_LAYOUT.map(row);
  if (tiles.length !== MAZE_ROWS || tiles.some((line) => line.length !== MAZE_COLUMNS)) {
    throw new Error('Classic maze dimensions are invalid.');
  }
  return createMaze(tiles);
};
