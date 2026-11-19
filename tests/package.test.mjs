import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { manifest, validatePackage } from '../scripts/package.mjs';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unzipSync } from 'fflate';
import { writePluginZip } from '../scripts/zip.mjs';
test('review metadata and genuine square logo assets conform to current upstream schemas', async () => {
  // Local transport address is an in-memory fixture, never a distributable MCP configuration.
  const mcp = { $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json', mcpServers: { 'electrician-route-checker': { type: 'streamable-http', url: 'http://localhost:3000/mcp' } } };
  await validatePackage(manifest(), mcp);
  const { review, interface: listing } = manifest().extensions['com.openai'];
  assert.equal(review.test_cases.positive.length, 5); assert.equal(review.test_cases.negative.length, 3); assert.equal(listing.defaultPrompt.length, 3);
  assert.ok(!('demo_recording_url' in review)); assert.equal(listing.termsOfServiceURL, 'https://elec.training/customer-complaints-policy/');
});
test('submission packaging stops before writing when the production endpoint is absent', () => {
  const env = { ...process.env }; delete env.MCP_ENDPOINT; delete env.TERMS_URL; delete env.DEMO_URL;
  const result = spawnSync(process.execPath, ['scripts/package.mjs'], { env, encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 1); assert.match(result.stderr, /MCP_ENDPOINT is required/);
});

test('portal category validation rejects the former Education value', async () => {
  const metadata = manifest();
  metadata.extensions['com.openai'].interface.category = 'Education';
  await assert.rejects(validatePackage(metadata, {}), /Unsupported OpenAI listing category: Education/);
});

test('upload ZIP uses matching safe forward-slash paths in local and central headers', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'route-checker-zip-'));
  const destination = join(directory, 'plugin.zip');
  const names = await writePluginZip('plugin', destination);
  const bytes = await readFile(destination);
  const decoded = unzipSync(bytes);
  assert.ok(decoded['assets/icon.png']);
  assert.ok(decoded['skills/electrician-route/SKILL.md']);
  assert.ok(decoded['plugin.json']); assert.ok(decoded['mcp.json']);
  const localNames = [];
  let offset = 0;
  while (bytes.readUInt32LE(offset) === 0x04034b50) {
    const length = bytes.readUInt16LE(offset + 26);
    const extra = bytes.readUInt16LE(offset + 28);
    localNames.push(bytes.subarray(offset + 30, offset + 30 + length).toString('utf8'));
    offset += 30 + length + extra + bytes.readUInt32LE(offset + 18);
  }
  assert.deepEqual(localNames, names);
  const centralNames = [];
  while (bytes.readUInt32LE(offset) === 0x02014b50) {
    const length = bytes.readUInt16LE(offset + 28);
    const extra = bytes.readUInt16LE(offset + 30);
    const comment = bytes.readUInt16LE(offset + 32);
    centralNames.push(bytes.subarray(offset + 46, offset + 46 + length).toString('utf8'));
    offset += 46 + length + extra + comment;
  }
  assert.deepEqual(centralNames, localNames);
  for (const name of localNames) {
    assert.ok(!name.includes('\\') && !name.startsWith('/') && !name.split('/').includes('..'));
    assert.deepEqual(Buffer.from(decoded[name]), await readFile(join('plugin', ...name.split('/'))));
  }
});
