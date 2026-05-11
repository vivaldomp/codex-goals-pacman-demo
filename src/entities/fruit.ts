import { FRUIT_DURATION } from '../constants/game';
import type { Vector2 } from '../types/vector';

export interface Fruit {
  tile: Vector2;
  visible: boolean;
  timer: number;
  value: number;
}

export const createFruit = (level: number): Fruit => ({
  tile: { x: 13, y: 17 },
  visible: false,
  timer: 0,
  value: level < 3 ? 100 : level < 5 ? 300 : 500
});

export const revealFruit = (fruit: Fruit): void => {
  fruit.visible = true;
  fruit.timer = FRUIT_DURATION;
};

export const updateFruit = (fruit: Fruit, deltaSeconds: number): void => {
  if (!fruit.visible) return;
  fruit.timer -= deltaSeconds;
  if (fruit.timer <= 0) fruit.visible = false;
};
