import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import sharp from 'sharp';
import { reviewMetadata } from '../tests/review-cases.mjs';
import { VERSION } from '../src/facts.mjs';

export const starterPrompts = ['How do I become an electrician in the UK as an adult?', "I've completed Level 3 electrical training. What should I do next?", "How can I complete an electrical NVQ if I don't have suitable workplace experience?"];
export const selectedTermsUrl = 'https://elec.training/customer-complaints-policy/';
export function manifest({ termsUrl = selectedTermsUrl, demoUrl } = {}) {
  return { $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'electrician-route-checker', version: VERSION, description: 'Plan your UK electrician training and qualification route', author: { name: 'Elec Training Ltd', url: 'https://elec.training/' }, homepage: 'https://elec.training/', repository: 'https://github.com/mandeeps207/elec-electrician-route-checker-mcp', keywords: ['education', 'electrician', 'training', 'career'], extensions: { 'com.openai': {
    interface: { displayName: 'Electrician Route Checker', shortDescription: 'Plan your UK electrician route', longDescription: 'Understand UK electrician training routes based on your current experience and qualifications. Electrician Route Checker explains Level 2, Level 3, 18th Edition, workplace-based Level 3 NVQ progression, external AM2 and appropriate ECS Gold Card eligibility. This provides high-level educational guidance, mainly for the adult installation pathway in England; requirements can differ by UK nation and occupation. It does not assess competence or confirm qualification/card eligibility.', developerName: 'Elec Training Ltd', category: 'Education', capabilities: ['Educational route guidance', 'Qualification explanations', 'NVQ workplace progression', 'Training route comparisons'], websiteURL: 'https://elec.training/', supportURL: 'https://elec.training/contact-us/', privacyPolicyURL: 'https://elec.training/privacy-policy/', ...(termsUrl ? { termsOfServiceURL: termsUrl } : {}), defaultPrompt: starterPrompts, brandColor: '#112e59', composerIcon: './assets/icon.png', logo: './assets/logo.png' },
    review: { test_cases: reviewMetadata, ...(demoUrl ? { demo_recording_url: demoUrl } : {}), commerce: false, commerce_description: 'The tools provide educational information only. They do not sell products, accept payments, collect leads or submit forms. Optional relevant external route-checker links are not required to use the tools.' }, publication: { countries: ['GB'], release_notes: 'Initial read-only release with four educational tools for likely electrician routes, qualification stages, NVQ workplace progression and route comparison. No login, contact collection, payments or form submissions.' }
  } } };
}

async function checkedUrl(name, value) {
  if (!value) throw new Error(`${name} is required; no submission ZIP will be built without it.`);
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.username || u.password || ['localhost', 'example.com', '127.0.0.1'].includes(u.hostname)) throw new Error(`${name} must be a real public HTTPS URL.`);
  if (name === 'MCP_ENDPOINT') {
    const { Client } = await import('@modelcontextprotocol/sdk/client/index.js'); const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
    const c = new Client({ name: 'package-preflight', version: VERSION }); try { await c.connect(new StreamableHTTPClientTransport(u)); if ((await c.listTools()).tools.length !== 4) throw new Error('Expected four tools'); } finally { await c.close(); }
  } else { const r = await fetch(u, { signal: AbortSignal.timeout(20000) }); if (!r.ok) throw new Error(`${name} is inaccessible: HTTP ${r.status}`); await r.body?.cancel(); }
  return u.href;
}

export async function validatePackage(metadata, mcp) {
  const ajv = new Ajv({ allErrors: true, strict: false, loadSchema: async uri => {
    const url = new URL(uri);
    if (url.protocol !== 'https:' || url.hostname !== 'agent-plugins.org') throw new Error('Unexpected schema reference');
    const response = await fetch(url); if (!response.ok) throw new Error('Cannot resolve official schema reference'); return response.json();
  } }); addFormats(ajv);
  for (const [kind, value] of [['plugin', metadata], ['mcp', mcp]]) {
    const response = await fetch(`https://agent-plugins.org/schemas/1.0.0/${kind}.schema.json`);
    if (!response.ok) throw new Error(`Cannot load official ${kind} schema`);
    const schema = await response.json(); const validate = await ajv.compileAsync(schema);
    if (!validate(value)) throw new Error(`${kind} schema: ${JSON.stringify(validate.errors)}`);
  }
  const i = metadata.extensions['com.openai'].interface;
  if (i.displayName.length > 30 || i.shortDescription.length > 30 || i.defaultPrompt.length !== 3) throw new Error('Listing text limits failed');
  if (metadata.extensions['com.openai'].review.test_cases.positive.length !== 5 || metadata.extensions['com.openai'].review.test_cases.negative.length !== 3) throw new Error('Review counts failed');
  for (const path of [i.logo, i.composerIcon]) { const image = await sharp('plugin/' + path).metadata(); if (image.width !== image.height || image.width < 48 || image.width > 4096) throw new Error('Invalid icon dimensions'); }
}
export async function main() {
  const endpoint = await checkedUrl('MCP_ENDPOINT', process.env.MCP_ENDPOINT);
  const termsUrl = await checkedUrl('TERMS_URL', process.env.TERMS_URL || selectedTermsUrl);
  const demoUrl = await checkedUrl('DEMO_URL', process.env.DEMO_URL);
  const metadata = manifest({ termsUrl, demoUrl });
  // No authentication is required. Omit auth extensions so the portable upstream schema remains valid.
  const mcp = { $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json', mcpServers: { 'electrician-route-checker': { type: 'streamable-http', url: endpoint } } };
  await validatePackage(metadata, mcp);
  await mkdir('plugin', { recursive: true });
  await writeFile('plugin/plugin.json', JSON.stringify(metadata, null, 2) + '\n');
  await writeFile('plugin/mcp.json', JSON.stringify(mcp, null, 2) + '\n');
  await mkdir('dist', { recursive: true });
  // Compress the contents so plugin.json, not an enclosing folder, is at the ZIP root.
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', "Compress-Archive -Path 'plugin/*' -DestinationPath 'dist/electrician-route-checker-1.0.0.zip' -Force"], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error(result.stderr || 'ZIP creation failed');
  console.log('Validated submission package: ' + resolve('dist/electrician-route-checker-1.0.0.zip'));
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/scripts/package.mjs')) main().catch(error => { console.error(error.message); process.exitCode = 1; });
