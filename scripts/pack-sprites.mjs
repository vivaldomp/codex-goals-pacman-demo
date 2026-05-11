import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { encodePng, createSheet } from './png.mjs';

const out = (path, buffer) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer);
};

const rgba = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255, 255];
};

const saveSheet = (path, columns, rows, painter) => {
  const sheet = createSheet(columns, rows, 16, painter);
  out(path, encodePng(sheet.width, sheet.height, sheet.pixels));
};

const pacmanColor = rgba('#ffd800');
saveSheet('assets/sprites/pacman.png', 8, 3, ({ circle, rect, size }) => {
  for (let frame = 0; frame < 24; frame += 1) {
    const ox = (frame % 8) * size;
    const oy = Math.floor(frame / 8) * size;
    const phase = frame % 4;
    circle(ox + 8, oy + 8, 7, pacmanColor, (x, y) => {
      if (frame >= 16) return phase > 0 && y < -5 + phase;
      if (phase === 0 || phase === 3) return false;
      const open = phase === 1 ? 2 : 4;
      if (frame < 4) return x > 0 && Math.abs(y) <= open;
      if (frame < 8) return x < 0 && Math.abs(y) <= open;
      if (frame < 12) return y < 0 && Math.abs(x) <= open;
      return y > 0 && Math.abs(x) <= open;
    });
    if (frame >= 16) rect(ox + 7, oy + 7, 2, 2, pacmanColor);
  }
});

const ghostColors = ['#ff2a2a', '#ffb8de', '#00f6ff', '#ffb84a'].map(rgba);
saveSheet('assets/sprites/ghosts.png', 4, 1, ({ rect, circle }) => {
  ghostColors.forEach((color, index) => {
    const ox = index * 16;
    circle(ox + 8, 7, 7, color, (_x, y) => y > 0);
    rect(ox + 1, 7, 14, 7, color);
    rect(ox + 2, 14, 3, 1, color);
    rect(ox + 7, 14, 3, 1, color);
    rect(ox + 12, 14, 2, 1, color);
    rect(ox + 4, 5, 3, 4, rgba('#ffffff'));
    rect(ox + 10, 5, 3, 4, rgba('#ffffff'));
    rect(ox + 5, 6, 1, 2, rgba('#103cff'));
    rect(ox + 11, 6, 1, 2, rgba('#103cff'));
  });
});

saveSheet('assets/sprites/frightened.png', 2, 1, ({ rect, circle }) => {
  ['#253cff', '#ffffff'].map(rgba).forEach((color, index) => {
    const ox = index * 16;
    circle(ox + 8, 7, 7, color, (_x, y) => y > 0);
    rect(ox + 1, 7, 14, 8, color);
    rect(ox + 4, 6, 2, 2, rgba('#ffffff'));
    rect(ox + 10, 6, 2, 2, rgba('#ffffff'));
    rect(ox + 4, 11, 8, 1, index === 0 ? rgba('#ffb8de') : rgba('#253cff'));
  });
});

saveSheet('assets/sprites/eyes.png', 1, 1, ({ rect }) => {
  rect(4, 5, 4, 4, rgba('#ffffff'));
  rect(10, 5, 4, 4, rgba('#ffffff'));
  rect(6, 6, 1, 2, rgba('#103cff'));
  rect(12, 6, 1, 2, rgba('#103cff'));
});

saveSheet('assets/sprites/pellets.png', 2, 1, ({ rect, circle }) => {
  rect(7, 7, 2, 2, rgba('#ffd6a0'));
  circle(24, 8, 4, rgba('#ffd6a0'));
});

saveSheet('assets/sprites/fruits.png', 2, 1, ({ rect, circle }) => {
  circle(7, 9, 4, rgba('#ff2a2a'));
  circle(11, 9, 4, rgba('#ff2a2a'));
  rect(8, 3, 2, 4, rgba('#20ff6b'));
  circle(24, 9, 5, rgba('#ffb84a'));
});

saveSheet('assets/tilesets/maze.png', 2, 1, ({ rect }) => {
  rect(0, 0, 16, 16, rgba('#0505a8'));
  rect(2, 2, 12, 12, rgba('#000000'));
  rect(16, 7, 16, 2, rgba('#ffb8de'));
});

saveSheet('assets/ui/hud.png', 2, 1, ({ circle, rect }) => {
  circle(8, 8, 6, pacmanColor, (x, y) => x > 0 && Math.abs(y) < 3);
  rect(21, 4, 6, 8, rgba('#ffffff'));
});

const prompts = [
  'pixel art bitmap sprite retro arcade transparent background sprite sheet 16x16 grid no antialiasing pacman mouth animation',
  'pixel art bitmap sprite retro arcade transparent background sprite sheet 16x16 grid no antialiasing ghosts frightened eyes',
  'pixel art bitmap sprite retro arcade transparent background sprite sheet 16x16 grid no antialiasing pellets fruits maze tiles HUD'
];

out('assets/raw-ai/prompts.json', Buffer.from(JSON.stringify({ prompts }, null, 2)));
out('assets/atlas.json', Buffer.from(JSON.stringify({
  frameSize: 16,
  sheets: ['pacman', 'ghosts', 'frightened', 'eyes', 'pellets', 'fruits', 'maze', 'hud'],
  generatedAt: new Date().toISOString()
}, null, 2)));

for (const file of [
  'sprites/pacman.png',
  'sprites/ghosts.png',
  'sprites/frightened.png',
  'sprites/eyes.png',
  'sprites/pellets.png',
  'sprites/fruits.png',
  'tilesets/maze.png',
  'ui/hud.png',
  'raw-ai/prompts.json',
  'atlas.json'
]) {
  const source = join('assets', file);
  const target = join('public/assets', file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await import('node:fs').then((fs) => fs.readFileSync(source))));
}

console.log('Packed bitmap sprite sheets and atlas metadata.');
