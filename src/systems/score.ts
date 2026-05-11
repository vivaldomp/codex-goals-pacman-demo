import { createStorage, type StoredSettings } from '../utils/storage';

export interface ScoreSystem {
  score: number;
  highScore: number;
  settings: StoredSettings;
  add(points: number): void;
  reset(): void;
  save(): void;
}

export const createScoreSystem = (): ScoreSystem => {
  const storage = createStorage('pacman-arcade-settings');
  const settings = storage.load();
  return {
    score: 0,
    highScore: settings.highScore,
    settings,
    add(points: number) {
      this.score += points;
      this.highScore = Math.max(this.highScore, this.score);
      this.settings.highScore = this.highScore;
    },
    reset() {
      this.score = 0;
    },
    save() {
      storage.save(this.settings);
    }
  };
};
