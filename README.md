# Electrician Route Checker

Electrician Route Checker is a read-only educational MCP service published by **Elec Training Ltd**. It helps adults understand common UK electrician training and qualification routes, from technical learning to suitable electrical work, workplace competence assessment and external assessment.

## Available tools

| Tool | Purpose |
| --- | --- |
| `get_electrician_route` | Likely next stages from qualifications and general work experience |
| `explain_electrical_stage` | Explain Level 2, Level 3, 18th Edition, NVQ, workplace evidence, AM2 or ECS Gold Card |
| `check_nvq_progression` | Explain workplace evidence needs and likely NVQ progression |
| `compare_electrician_routes` | Compare apprenticeships, college, T Levels and private adult training |

Every tool is annotated read-only, non-destructive, idempotent and bounded (`openWorldHint: false`). The tools do not browse or initiate external actions.

Production MCP endpoint: **https://elec-electrician-route-checker.vercel.app/mcp**. Hosting: Vercel, project `elec-electrician-route-checker` in `mkwebtecindias-projects`. The stable production alias is used in `plugin/mcp.json`; do not replace it with a deployment-specific preview address. Public unauthenticated MCP tests passed on 17 November 2026. ChatGPT and submission validation remain pending.

## Development

Use Node.js 22, then `npm ci`, `npm test`, `npm run test:review` and `npm start`. The local MCP endpoint is `http://localhost:3000/mcp`. The service uses the official MCP SDK and stateless Streamable HTTP with JSON responses. No API key or database is required. `npm audit` checks the locked dependency tree.

Example MCP `tools/call` parameters after protocol initialisation:

```json
{"name":"get_electrician_route","arguments":{"starting_point":"complete_beginner","existing_qualifications":["none"],"electrical_work_experience":"none","currently_working_in_electrical":false,"study_preference":"blended","jurisdiction":"england"}}
```

```json
{"name":"explain_electrical_stage","arguments":{"topic":"AM2"}}
```

```json
{"name":"check_nvq_progression","arguments":{"technical_training_stage":"level_3_technical","currently_working_in_electrical":false,"workplace_experience":"none","existing_nvq_progress":"not_started"}}
```

```json
{"name":"compare_electrician_routes","arguments":{"routes":["apprenticeship","private_adult_training"]}}
```

`tools/list` exposes exact input and output JSON schemas. Inputs use enums and booleans rather than personal free text. Origin checks allow ChatGPT and the OpenAI platform; other browser clients require explicit comma-separated `ALLOWED_ORIGINS`. Server-to-server clients can omit Origin. Application body size is limited to 16 KiB; the host may impose additional limits. No unauthenticated browser origin is automatically reflected. The service exposes POST and OPTIONS only; GET/DELETE return 405 because it maintains no sessions or notification streams.

## Route logic and limits

The common adult installation route is Level 2 → Level 3 technical training → 18th Edition if needed → suitable real electrical work → workplace-based Level 3 NVQ → external AM2 → application for an appropriate ECS Gold Card if remaining requirements are met. Workplace learning can overlap with technical study. Recognised existing awards are taken into account; contradictory starting information is flagged.

This mainly describes the adult installation pathway in England. Routes and card schemes vary across Scotland, Wales and Northern Ireland, occupations, apprenticeships, experienced workers and overseas learning. A technical diploma is not an occupational competence award. Exact certificate numbers, units, the applicable AM2/AM2S/AM2E assessment, current BS 7671 and ECS/SJIB requirements need direct verification. The service cannot decide qualification or card eligibility.

The versioned provider facts come from the publisher-approved project brief reviewed on 17 November 2026. Provider claims are identified as publisher supplied, not independently verified outcomes. Prices are dated and must be reconfirmed. Promotional outcome statistics are deliberately omitted from route advice because they are unnecessary to explain a learner’s next step. Refresh the fact base before each release and periodically after launch.

Elec Training does not offer apprenticeships or deliver AM2. Its paid placement guarantee is restricted to Level 3 NVQ learners who need workplace experience required to complete their qualification. Placement support is separately charged where required and is not automatically included in the base NVQ fee.

## Privacy

There are no user accounts, cookies, analytics, prompt store, contact fields, CRM writes, payments, email or form submissions. Arguments are processed transiently; runtime code does not log them. Hosting infrastructure may process operational metadata. Confirm host retention and the coverage of the publisher’s existing privacy policy before submission. See `docs/privacy-review.md` for implementation details.

## Hosting and release

`vercel.json` defines a Node function exposed at `/mcp` and a static service information page. Deploy to a verified intended project/team using production configuration. Keep source private. Confirm a stable public HTTPS production origin, access without authentication and domain verification before packaging. Do not use a temporary preview URL for submission.

Run `MCP_ENDPOINT`-targeted `npm run test:review` against the deployed endpoint; use PowerShell `$env:MCP_ENDPOINT = 'actual endpoint'`. This checks protocol and curated tool outputs, not ChatGPT’s natural-language tool selection. Repeat the eight review prompts in ChatGPT and record the production walkthrough separately.

Run `node scripts/branding.mjs` to derive square padded assets from the genuine official header logo. Run `npm run package` with `MCP_ENDPOINT`, `TERMS_URL` and `DEMO_URL` set to verified real HTTPS URLs. Packaging fails closed when these are missing or inaccessible. It writes the portable plugin manifest, MCP configuration, review metadata and a ZIP with contents at its root. It does not upload or submit anything.

Public OpenAI submission and publication require separate publisher approval of the build and test results. The automated OpenAI scan, organisation identity/access, eligible data residency, domain verification, production ChatGPT testing and recording remain external release gates. See `docs/release-status.md` for the current handoff.
