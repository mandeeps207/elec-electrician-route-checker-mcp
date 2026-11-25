import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from '../src/server.mjs';
import { readFile } from 'node:fs/promises';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const fail = (status, message) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: message })); };
  // Origins are checked independently of Host; absent Origin is valid for server-to-server clients.
  if (req.headers.origin) {
    const allowed = new Set(['https://chatgpt.com', 'https://chat.openai.com', 'https://platform.openai.com', ...(process.env.ALLOWED_ORIGINS ?? '').split(',').filter(Boolean)]);
    if (process.env.NODE_ENV !== 'production') allowed.add('http://localhost:3000');
    if (!allowed.has(req.headers.origin)) return fail(403, 'Origin not allowed');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id', 'Access-Control-Expose-Headers': 'MCP-Session-Id' }); res.end(); return;
  }
  const accept = String(req.headers.accept ?? '').toLowerCase();
  // MCP GET requests seek an SSE stream, which this stateless service does not offer.
  // Ordinary browser and directory requests receive the public setup instructions.
  if (['GET', 'HEAD'].includes(req.method) && !accept.includes('text/event-stream') && (!accept || accept.includes('text/html') || accept.includes('*/*'))) {
    const page = await readFile(new URL('../public/index.html', import.meta.url));
    res.setHeader('Vary', req.headers.origin ? 'Origin, Accept' : 'Accept');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : page);
    return;
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST, GET, HEAD, OPTIONS'); return fail(405, 'Stateless MCP supports POST messages; browser GET requests show setup instructions. No server notification stream or session deletion.'); }
  if (!String(req.headers['content-type'] ?? '').toLowerCase().startsWith('application/json')) return fail(415, 'Use application/json');
  if (Number(req.headers['content-length'] ?? 0) > 16384) return fail(413, 'Request too large');
  let body = req.body;
  try {
    if (body === undefined) {
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if (size > 16384) return fail(413, 'Request too large'); chunks.push(chunk); }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } else if (typeof body === 'string' || Buffer.isBuffer(body)) body = JSON.parse(body.toString());
    if (Buffer.byteLength(JSON.stringify(body)) > 16384) return fail(413, 'Request too large');
  } catch { return fail(400, 'Invalid JSON request'); }
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch {
    // Deliberately never log request bodies, inputs, headers or exception objects.
    console.error('MCP request failed');
    if (!res.headersSent) fail(500, 'Unable to process MCP request');
  } finally { await transport.close(); await server.close(); }
}
