import sharp from "sharp";

/**
 * Add a subtle "textphoto.app" watermark to the bottom-right corner of an
 * image. Used on share-flow images so every viral copy of the picture carries
 * the brand back to us.
 *
 * Watermark scales with image size: ~3.5% of width for font, 4% margin from
 * edges. Always readable, never dominant.
 */
export async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  // Probe metadata to size the watermark proportionally
  const meta = await sharp(imageBuffer).metadata();
  const w = meta.width || 1024;
  const h = meta.height || 1024;

  // Watermark sizing
  const fontSize = Math.max(14, Math.round(w * 0.022));
  const padX = Math.round(w * 0.018);
  const padY = Math.round(h * 0.025);
  const text = "textphoto.app";

  // Approximate text width: ~0.55em per character for sans-serif
  const textWidth = Math.round(fontSize * text.length * 0.55);
  const bgWidth = textWidth + padX * 2;
  const bgHeight = Math.round(fontSize * 1.6);

  // Build watermark as an SVG overlay (resolution-independent, no font deps)
  const svg = `
<svg width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.2"/>
      <feOffset dx="0" dy="1" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect x="0" y="0" width="${bgWidth}" height="${bgHeight}" rx="${Math.round(bgHeight / 2)}" ry="${Math.round(bgHeight / 2)}" fill="rgba(0,0,0,0.45)"/>
  <text x="${padX}" y="${Math.round(bgHeight * 0.68)}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="600" fill="white" filter="url(#shadow)">${text}</text>
</svg>`;

  return sharp(imageBuffer)
    .composite([
      {
        input: Buffer.from(svg),
        // Bottom-right corner with margin
        top: h - bgHeight - padY,
        left: w - bgWidth - padX,
        blend: "over",
      },
    ])
    .png()
    .toBuffer();
}
