export interface SpriteSheet {
  image: HTMLImageElement;
  frameSize: number;
  loaded: boolean;
}

export const loadSpriteSheet = (src: string, frameSize = 16): SpriteSheet => {
  const image = new Image();
  const sheet: SpriteSheet = { image, frameSize, loaded: false };
  image.addEventListener('load', () => {
    sheet.loaded = true;
  });
  image.src = src;
  return sheet;
};

export const drawFrame = (
  context: CanvasRenderingContext2D,
  sheet: SpriteSheet,
  frame: number,
  x: number,
  y: number,
  size = sheet.frameSize
): void => {
  if (!sheet.loaded) return;
  const columns = Math.max(1, Math.floor(sheet.image.width / sheet.frameSize));
  const sx = (frame % columns) * sheet.frameSize;
  const sy = Math.floor(frame / columns) * sheet.frameSize;
  context.drawImage(sheet.image, sx, sy, sheet.frameSize, sheet.frameSize, Math.round(x), Math.round(y), size, size);
};
