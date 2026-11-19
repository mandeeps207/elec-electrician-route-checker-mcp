import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { zipSync, unzipSync } from 'fflate';

export async function writePluginZip(source, destination) {
  const files = Object.create(null);
  async function collect(directory, prefix = '') {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.isSymbolicLink()) throw new Error('Plugin ZIP cannot include symbolic links');
      if (/[\\:\x00]/.test(entry.name) || ['.', '..'].includes(entry.name)) throw new Error('Unsafe plugin filename');
      const name = prefix + entry.name;
      if (entry.isDirectory()) await collect(join(directory, entry.name), name + '/');
      else if (entry.isFile()) files[name] = new Uint8Array(await readFile(join(directory, entry.name)));
      else throw new Error('Plugin ZIP can contain only regular files');
    }
  }
  await collect(source);
  if (!files['plugin.json'] || !files['mcp.json']) throw new Error('Plugin and MCP manifests must be at the ZIP root');
  const bytes = zipSync(files, { level: 6 });
  // Check payloads as well as archive names before writing the deliverable.
  const restored = unzipSync(bytes);
  for (const [name, data] of Object.entries(files)) {
    if (!restored[name] || !Buffer.from(restored[name]).equals(Buffer.from(data))) throw new Error('ZIP round-trip failed');
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  return Object.keys(files);
}
