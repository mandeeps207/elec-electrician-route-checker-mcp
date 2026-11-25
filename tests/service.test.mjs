import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { tools } from '../src/server.mjs';
import { localServer } from '../src/local.mjs';
import { positive, negative } from './review-cases.mjs';
import { getElectricianRoute, checkNvqProgression } from '../src/guidance.mjs';
import { ImplementationSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

test('real MCP connection, discovery, every tool, every stage and review case', async () => {
  const s = localServer(); await new Promise(r => s.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${s.address().port}/mcp`;
  const client = new Client({ name: 'acceptance', version: '1.0.0' });
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(url)));
    const metadata = client.getServerVersion();
    assert.deepEqual(ImplementationSchema.parse(metadata), metadata);
    assert.equal(metadata.name, 'electrician-route-checker');
    assert.equal(metadata.version, '1.0.0');
    assert.equal(metadata.title, 'Electrician Route Checker');
    assert.match(metadata.description, /UK electrician qualification routes/);
    assert.equal(metadata.websiteUrl, 'https://elec.training/');
    assert.deepEqual(metadata.icons, [{ src: 'https://elec-electrician-route-checker.vercel.app/icon.png', mimeType: 'image/png', sizes: ['512x512'] }]);
    const icon = await readFile(new URL('../public/icon.png', import.meta.url));
    assert.deepEqual(icon, await readFile(new URL('../plugin/assets/icon.png', import.meta.url)));
    const image = await sharp(icon).metadata();
    assert.equal(image.width, 512); assert.equal(image.height, 512);
    assert.deepEqual(client.getServerCapabilities(), { tools: { listChanged: true } });
    assert.match(client.getInstructions(), /Elec Training does not deliver it/);
    const list = await client.listTools(); assert.equal(list.tools.length, 4);
    function checkDescriptions(schema) {
      for (const field of Object.values(schema.properties ?? {})) {
        assert.ok(field.description?.trim(), 'Every returned schema field needs usage documentation');
        checkDescriptions(field);
      }
      if (schema.items) checkDescriptions(schema.items);
    }
    for (const tool of list.tools) { checkDescriptions(tool.inputSchema); checkDescriptions(tool.outputSchema); }
    for (const t of list.tools) { assert.equal(t.annotations.readOnlyHint, true); assert.equal(t.annotations.destructiveHint, false); assert.equal(t.annotations.openWorldHint, false); assert.ok(t.outputSchema); }
    for (const c of [...positive, ...negative]) { const result = await client.callTool({ name: c.tools_triggered, arguments: c.args }); assert.ok(!result.isError, c.prompt); const text = JSON.stringify(result.structuredContent).toLowerCase(); for (const expected of c.checks) assert.ok(text.includes(expected.toLowerCase()), `${c.description}: ${expected}`); }
    for (const topic of ['Level 2', 'Level 3', '18th Edition', 'Level 3 NVQ', 'workplace evidence', 'AM2', 'ECS Gold Card']) { const result = await client.callTool({ name: 'explain_electrical_stage', arguments: { topic } }); assert.ok(!result.isError); assert.equal(result.structuredContent.topic, topic); }
    const invalid = await client.callTool({ name: 'get_electrician_route', arguments: { starting_point: 'complete_beginner', email: 'not-accepted' } }); assert.ok(invalid.isError); assert.ok(!JSON.stringify(invalid).includes('not-accepted'));
    const unsupported = await client.callTool({ name: 'explain_electrical_stage', arguments: { topic: 'wiring instructions' } }); assert.ok(unsupported.isError);
    const missing = await client.callTool({ name: 'not_a_tool', arguments: {} }); assert.ok(missing.isError);
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
    const blocked = await fetch(url, { method: 'POST', headers: { ...headers, Origin: 'https://untrusted.invalid' }, body: '{}' }); assert.equal(blocked.status, 403);
    const validOrigin = await fetch(url, { method: 'OPTIONS', headers: { Origin: 'https://chatgpt.com' } }); assert.equal(validOrigin.status, 204);
    const malformed = await fetch(url, { method: 'POST', headers, body: '{' }); assert.equal(malformed.status, 400);
    const large = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ value: 'x'.repeat(17000) }) }); assert.equal(large.status, 413);
    assert.equal((await fetch(url)).status, 405);
    const init = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'protocol-test', version: '1.0' } } }) }); assert.equal(init.status, 200); assert.equal(init.headers.get('mcp-session-id'), null);
  } finally { await client.close(); await new Promise(r => s.close(r)); }
});

test('route branches preserve prior awards, uncertainty and workplace requirements', () => {
  for (const starting_point of ['complete_beginner', 'level_2_completed', 'level_3_completed', 'already_working_electrical', 'construction_or_other_trade', 'unsure']) {
    const t = tools[0]; const result = t.outputSchema.parse(t.run(t.inputSchema.parse({ starting_point })));
    assert.ok(result.likely_next_step); assert.ok(result.workplace_requirement.includes('assessor'));
  }
  const graduate = getElectricianRoute({ starting_point: 'complete_beginner', existing_qualifications: ['level_3_nvq', 'am2', '18th_edition'] }); assert.equal(graduate.current_stage, 'nvq_completed'); assert.equal(graduate.high_level_route.length, 1); assert.ok(graduate.questions_to_resolve.length);
  const l3 = getElectricianRoute({ starting_point: 'unsure', existing_qualifications: ['level_3_technical', '18th_edition'] }); assert.equal(l3.current_stage, 'level_3_completed'); assert.ok(!l3.high_level_route.some(s => s.startsWith('18th Edition')));
  const done = checkNvqProgression({ technical_training_stage: 'level_3_technical', existing_nvq_progress: 'completed' }); assert.equal(done.workplace_evidence_likely_required, false); assert.equal(done.provider_support, undefined);
  for (const t of tools) { assert.equal(t.inputSchema.safeParse({ full_name: 'rejected' }).success, false); }
});
