import { FIXED_TIMESTEP } from '../constants/game';

export class GameLoop {
  private previous = 0;
  private accumulator = 0;
  private frame = 0;

  constructor(private update: (deltaSeconds: number) => void, private render: () => void) {}

  start(): void {
    this.previous = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  stop(): void {
    cancelAnimationFrame(this.frame);
  }

  private tick = (time: number): void => {
    const elapsed = Math.min(0.1, (time - this.previous) / 1000);
    this.previous = time;
    this.accumulator += elapsed;
    while (this.accumulator >= FIXED_TIMESTEP) {
      this.update(FIXED_TIMESTEP);
      this.accumulator -= FIXED_TIMESTEP;
    }
    this.render();
    this.frame = requestAnimationFrame(this.tick);
  };
}
