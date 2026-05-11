export type SoundName = 'start' | 'pellet' | 'power' | 'ghost' | 'death' | 'intermission' | 'level';

const SOUND_FREQ: Record<SoundName, number> = {
  start: 330,
  pellet: 760,
  power: 220,
  ghost: 520,
  death: 110,
  intermission: 440,
  level: 660
};

export class AudioManager {
  private context: AudioContext | null = null;

  constructor(private volume: number, private muted: boolean) {}

  setVolume(volume: number, muted: boolean): void {
    this.volume = volume;
    this.muted = muted;
  }

  play(name: SoundName): void {
    if (this.muted) return;
    this.context ??= new AudioContext();
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.frequency.value = SOUND_FREQ[name];
    oscillator.type = name === 'death' ? 'sawtooth' : 'square';
    gain.gain.setValueAtTime(this.volume * 0.08, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.11);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.12);
  }
}
