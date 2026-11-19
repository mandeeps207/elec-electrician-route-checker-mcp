import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { manifest, validatePackage } from '../scripts/package.mjs';
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
