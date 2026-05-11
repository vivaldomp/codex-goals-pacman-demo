import { Direction } from '../constants/directions';
import type { ControlSettings } from '../utils/storage';

export interface InputState {
  direction: Direction;
  pausePressed: boolean;
  startPressed: boolean;
  debugPressed: boolean;
}

export class InputManager {
  private direction = Direction.None;
  private pausePressed = false;
  private startPressed = false;
  private debugPressed = false;

  constructor(private controls: ControlSettings) {
    window.addEventListener('keydown', this.onKeyDown);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  pollGamepad(): void {
    const pad = navigator.getGamepads?.()[0];
    if (!pad) return;
    const [xAxis = 0, yAxis = 0] = pad.axes;
    if (xAxis < -0.45) this.direction = Direction.Left;
    if (xAxis > 0.45) this.direction = Direction.Right;
    if (yAxis < -0.45) this.direction = Direction.Up;
    if (yAxis > 0.45) this.direction = Direction.Down;
    if (pad.buttons[9]?.pressed) this.startPressed = true;
    if (pad.buttons[8]?.pressed) this.pausePressed = true;
  }

  consume(): InputState {
    this.pollGamepad();
    const state = {
      direction: this.direction,
      pausePressed: this.pausePressed,
      startPressed: this.startPressed,
      debugPressed: this.debugPressed
    };
    this.pausePressed = false;
    this.startPressed = false;
    this.debugPressed = false;
    return state;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === this.controls.up) this.direction = Direction.Up;
    if (event.code === this.controls.down) this.direction = Direction.Down;
    if (event.code === this.controls.left) this.direction = Direction.Left;
    if (event.code === this.controls.right) this.direction = Direction.Right;
    if (event.code === 'KeyP') this.pausePressed = true;
    if (event.code === 'Enter' || event.code === 'Space') this.startPressed = true;
    if (event.code === 'F3') this.debugPressed = true;
  };
}
