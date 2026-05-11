export interface ControlSettings {
  up: string;
  down: string;
  left: string;
  right: string;
}

export interface StoredSettings {
  highScore: number;
  volume: number;
  muted: boolean;
  controls: ControlSettings;
}

export const DEFAULT_SETTINGS: StoredSettings = {
  highScore: 0,
  volume: 0.45,
  muted: false,
  controls: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
  }
};

export const createStorage = (key: string) => ({
  load(): StoredSettings {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return { ...DEFAULT_SETTINGS, controls: { ...DEFAULT_SETTINGS.controls } };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) as Partial<StoredSettings> };
  },
  save(settings: StoredSettings): void {
    globalThis.localStorage?.setItem(key, JSON.stringify(settings));
  }
});
