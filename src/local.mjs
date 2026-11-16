import http from 'node:http';
import { pathToFileURL } from 'node:url';
import handler from '../api/mcp.mjs';
export function localServer() {
  return http.createServer(async (req, res) => {
    if (req.url?.split('?')[0] === '/mcp') return handler(req, res);
    if (req.url === '/' || req.url === '/health') { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ service: 'Electrician Route Checker', publisher: 'Elec Training Ltd', version: '1.0.0', status: 'ok', transport: 'Streamable HTTP', endpoint: '/mcp', tools: 4, read_only: true, authentication: 'none' })); return; }
    res.writeHead(404); res.end();
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) localServer().listen(Number(process.env.PORT ?? 3000), '127.0.0.1', () => console.log('Electrician Route Checker listening on http://localhost:3000/mcp'));
