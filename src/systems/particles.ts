import type { Vector2 } from '../types/vector';

export interface Particle {
  position: Vector2;
  velocity: Vector2;
  life: number;
  color: string;
}

export class ParticlePool {
  private readonly particles: Particle[] = [];

  spawn(position: Vector2, color: string): void {
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      this.particles.push({
        position: { ...position },
        velocity: { x: Math.cos(angle) * 38, y: Math.sin(angle) * 38 },
        life: 0.35,
        color
      });
    }
  }

  update(deltaSeconds: number): void {
    for (const particle of this.particles) {
      particle.life -= deltaSeconds;
      particle.position.x += particle.velocity.x * deltaSeconds;
      particle.position.y += particle.velocity.y * deltaSeconds;
    }
    let write = 0;
    for (const particle of this.particles) {
      if (particle.life > 0) this.particles[write++] = particle;
    }
    this.particles.length = write;
  }

  all(): readonly Particle[] {
    return this.particles;
  }
}
