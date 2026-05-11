export enum Direction {
  None = 'none',
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

export const DIRECTION_VECTORS: Record<Direction, { x: number; y: number }> = {
  [Direction.None]: { x: 0, y: 0 },
  [Direction.Up]: { x: 0, y: -1 },
  [Direction.Down]: { x: 0, y: 1 },
  [Direction.Left]: { x: -1, y: 0 },
  [Direction.Right]: { x: 1, y: 0 }
};

export const DIRECTIONS: Direction[] = [Direction.Up, Direction.Left, Direction.Down, Direction.Right];
