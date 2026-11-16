import { mkdir, writeFile } from 'node:fs/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { positive, negative } from '../tests/review-cases.mjs';
import { localServer } from '../src/local.mjs';
let server;
let endpoint = process.env.MCP_ENDPOINT;
if (!endpoint) { server = localServer(); await new Promise(r => server.listen(0, '127.0.0.1', r)); endpoint = `http://127.0.0.1:${server.address().port}/mcp`; }
const client = new Client({ name: 'route-checker-review', version: '1.0.0' });
const report = { endpoint, tested_at: new Date().toISOString(), test_layer: 'Real MCP SDK client tool calls with curated input mappings. Does not verify ChatGPT tool selection or natural-language answers.', tools: [], positive: [], negative: [] };
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
  const discovered = (await client.listTools()).tools;
  for (const t of discovered) report.tools.push({ name: t.name, annotations: t.annotations, inputSchema: t.inputSchema, outputSchema: t.outputSchema });
  for (const [kind, cases] of Object.entries({ positive, negative })) for (const c of cases) {
    const output = await client.callTool({ name: c.tools_triggered, arguments: c.args });
    const content = JSON.stringify(output.structuredContent);
    const missing = c.checks.filter(s => !content.toLowerCase().includes(s.toLowerCase()));
    report[kind].push({ prompt: c.prompt, tool: c.tools_triggered, arguments: c.args, expected_behavior: c.expected_behavior, status: !output.isError && !missing.length ? 'PASS' : 'FAIL', missing, output: output.structuredContent });
  }
  report.status = [...report.positive, ...report.negative].every(t => t.status === 'PASS') && discovered.length === 4 ? 'PASS' : 'FAIL';
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/' + (process.env.MCP_ENDPOINT ? 'production' : 'local') + '-review.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ endpoint, status: report.status, tools: discovered.map(t => t.name), positive: report.positive.map(t => t.status), negative: report.negative.map(t => t.status) }, null, 2));
  if (report.status !== 'PASS') process.exitCode = 1;
} finally { await client.close(); if (server) await new Promise(r => server.close(r)); }
