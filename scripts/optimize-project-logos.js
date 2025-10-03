#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { optimize } from 'svgo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logosDir = path.resolve(__dirname, '../public/images/projects');

const rasterExtensions = new Set(['.png', '.jpg', '.jpeg']);
const svgExtensions = new Set(['.svg']);
const maxDimension = 1024;

let totalBytesSaved = 0;
let processed = 0;
let generatedWebp = 0;

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function processSvg(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  const before = Buffer.byteLength(raw, 'utf-8');

  const result = optimize(raw, {
    path: filePath,
    multipass: true,
    plugins: [
      'preset-default',
      {
        name: 'removeViewBox',
        active: false
      }
    ]
  });

  if (result.error) {
    console.error(`❌ Failed to optimize SVG ${path.basename(filePath)}: ${result.error}`);
    return;
  }

  await fs.writeFile(filePath, result.data, 'utf-8');
  const after = Buffer.byteLength(result.data, 'utf-8');
  const delta = before - after;
  totalBytesSaved += Math.max(0, delta);
  console.log(`🟢 Optimized SVG: ${path.basename(filePath)} (saved ${formatKb(Math.max(0, delta))})`);
  processed++;
}

async function processRaster(filePath, ext) {
  const original = await fs.readFile(filePath);
  const before = original.length;
  const image = sharp(original, { failOn: 'warning' });
  const metadata = await image.metadata();

  const resizeConfig = {
    width: metadata.width ? Math.min(metadata.width, maxDimension) : maxDimension,
    height: metadata.height ? Math.min(metadata.height, maxDimension) : maxDimension,
    fit: 'inside',
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3
  };

  let optimizedBuffer;
  if (ext === '.png') {
    optimizedBuffer = await sharp(original)
      .resize(resizeConfig)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
  } else {
    optimizedBuffer = await sharp(original)
      .resize(resizeConfig)
      .jpeg({ quality: 95, progressive: true, mozjpeg: true })
      .toBuffer();
  }

  await fs.writeFile(filePath, optimizedBuffer);
  const after = optimizedBuffer.length;
  totalBytesSaved += Math.max(0, before - after);
  processed++;

  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  const webpBuffer = await sharp(original)
    .resize(resizeConfig)
    .webp({ quality: 95, effort: 5 })
    .toBuffer();
  await fs.writeFile(webpPath, webpBuffer);
  generatedWebp++;

  console.log(
    `🟢 Optimized ${path.basename(filePath)} (${formatKb(after)}, saved ${formatKb(Math.max(0, before - after))}); generated ${path.basename(webpPath)} (${formatKb(webpBuffer.length)})`
  );
}

async function walkDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (svgExtensions.has(ext)) {
      await processSvg(fullPath);
    } else if (rasterExtensions.has(ext)) {
      await processRaster(fullPath, ext);
    } else {
      console.log(`⚪ Skipped ${entry.name}`);
    }
  }
}

async function main() {
  try {
    await walkDirectory(logosDir);

    console.log('\n📊 Optimization summary');
    console.log(`   Processed files: ${processed}`);
    console.log(`   Generated WebP variants: ${generatedWebp}`);
    console.log(`   Total bytes saved: ${formatKb(totalBytesSaved)}`);
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Optimization failed', error);
    process.exit(1);
  }
}

main();
