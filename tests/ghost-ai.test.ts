import { describe, expect, it } from 'vitest';
import { Direction } from '../src/constants/directions';
import { GhostName, createGhostBrain, getGhostTarget } from '../src/ai/ghost-ai';

describe('ghost target tiles', () => {
  const pacman = { tile: { x: 10, y: 10 }, direction: Direction.Right };
  const blinky = { tile: { x: 12, y: 10 } };

  it('targets Pacman directly for Blinky', () => {
    expect(getGhostTarget(GhostName.Blinky, pacman, blinky)).toEqual({ x: 10, y: 10 });
  });

  it('targets four tiles ahead for Pinky', () => {
    expect(getGhostTarget(GhostName.Pinky, pacman, blinky)).toEqual({ x: 14, y: 10 });
  });

  it('uses Blinky vector logic for Inky', () => {
    expect(getGhostTarget(GhostName.Inky, pacman, blinky)).toEqual({ x: 12, y: 10 });
  });

  it('switches scatter and chase by timer', () => {
    const brain = createGhostBrain();

    brain.update(7.1);
    expect(brain.mode).toBe('chase');

    brain.update(20.1);
    expect(brain.mode).toBe('scatter');
  });
});
