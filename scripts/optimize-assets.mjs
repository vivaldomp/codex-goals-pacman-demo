import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const files = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else files.push(path);
  }
};

walk('assets');

for (const file of files) {
  const target = join('public/assets', relative('assets', file));
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(file, target);
}

writeFileSync('public/assets/manifest.json', JSON.stringify({
  cacheBust: Date.now().toString(36),
  png: files.filter((file) => file.endsWith('.png')).map((file) => relative('assets', file)),
  metadata: files.filter((file) => file.endsWith('.json')).map((file) => relative('assets', file))
}, null, 2));

console.log(`Optimized ${files.length} asset files into public/assets.`);
