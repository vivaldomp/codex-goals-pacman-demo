import './style.css';
import { Game } from './core/game';
import { GameLoop } from './core/game-loop';
import { InputManager } from './input/input-manager';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { createStorage } from './utils/storage';

const canvas = document.querySelector<HTMLCanvasElement>('#game');
if (!canvas) throw new Error('Game canvas not found.');

const settings = createStorage('pacman-arcade-settings').load();
const renderer = new CanvasRenderer(canvas);
const input = new InputManager(settings.controls);
const game = new Game(renderer, input);
const loop = new GameLoop((delta) => game.update(delta), () => game.render());

loop.start();

window.addEventListener('beforeunload', () => {
  input.dispose();
  loop.stop();
});
