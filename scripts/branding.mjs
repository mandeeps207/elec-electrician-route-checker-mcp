import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
// Keep the genuine full wordmark intact. White square padding, no redraw or crop.
const original = await readFile('plugin/assets/official-logo-source.jpg');
for (const [name, size] of [['icon.png', 512], ['logo.png', 1024]]) {
  await sharp(original).resize(size, size, { fit: 'contain', background: '#ffffff' }).png().toFile(`plugin/assets/${name}`);
}
await writeFile('plugin/assets/PROVENANCE.md', '# Official logo provenance\n\nDownloaded on 17 November 2026 from the logo referenced in the official Elec Training website header.\n\nhttps://elec.training/wp-content/uploads/2023/09/Elec-Training-Logo-scaled-e1772290125555.jpg\n\nThe full wordmark is preserved without redrawing, recolouring or cropping, with white padding to produce square 512 px and 1024 px PNG assets. Check legibility in the directory before submission.\n');
console.log('Official logo assets created');
