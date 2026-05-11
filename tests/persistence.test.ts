import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStorage } from '../src/utils/storage';

describe('storage', () => {
  const values = new Map<string, string>();

  beforeEach(() => {
    values.clear();
    vi.stubGlobal('localStorage', {
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value)
    });
  });

  it('persists high score, controls, and audio settings', () => {
    const storage = createStorage('test-pacman');

    storage.save({ highScore: 1200, volume: 0.25, muted: true, controls: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' } });

    expect(storage.load()).toEqual({
      highScore: 1200,
      volume: 0.25,
      muted: true,
      controls: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
    });
  });
});
