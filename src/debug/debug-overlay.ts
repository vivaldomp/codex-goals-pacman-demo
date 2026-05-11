export interface DebugState {
  enabled: boolean;
  fps: number;
}

export class FpsCounter {
  private frames = 0;
  private elapsed = 0;
  fps = 0;

  update(deltaSeconds: number): void {
    this.frames += 1;
    this.elapsed += deltaSeconds;
    if (this.elapsed >= 0.5) {
      this.fps = Math.round(this.frames / this.elapsed);
      this.frames = 0;
      this.elapsed = 0;
    }
  }
}
