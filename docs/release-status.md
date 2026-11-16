# Electrician Route Checker build review

Prepared for Elec Training Ltd on 17 November 2026. **Ready for submission: NO.** No OpenAI draft has been uploaded, scanned, submitted or published.

The four-tool MCP service is built and passes local protocol and guidance checks. The working GitHub repository is private. Production deployment is blocked by hosting access; the final submission ZIP is deliberately withheld until actual production, terms and recording URLs are supplied and verified.

## Requested status

| Item | Result |
| --- | --- |
| MCP production URL | Not deployed; hosting access blocked |
| GitHub repository | https://github.com/mandeeps207/elec-electrician-route-checker-mcp — private |
| Hosting platform | Vercel targeted; no project or deployment created |
| Tool 1 get_electrician_route | PASS locally through the MCP SDK client |
| Tool 2 explain_electrical_stage | PASS locally through the MCP SDK client, including all seven topics |
| Tool 3 check_nvq_progression | PASS locally through the MCP SDK client |
| Tool 4 compare_electrician_routes | PASS locally through the MCP SDK client |
| Website URL | https://elec.training/ |
| Support URL | https://elec.training/contact-us/ — proposed existing contact page |
| Privacy URL | https://elec.training/privacy-policy/ — coverage review outstanding |
| Terms URL | No suitable approved working URL verified; publisher input required |
| Five positive tests | 5/5 PASS at the mapped MCP tool-response layer; ChatGPT evaluation not run |
| Three negative tests | 3/3 PASS at the mapped MCP tool-response layer; ChatGPT evaluation not run |
| Demo URL | Not recorded; production ChatGPT session required; script prepared |
| OpenAI automated scan | NOT RUN |
| Ready for submission | NO |

## Build contents

Runtime code, dependency lockfile, Vercel configuration, development instructions, exact tool schemas, MCP acceptance tests, eight exact review cases, official-logo source and padded icon assets, draft portable metadata, packaged skill instructions, release notes, privacy implementation note, support-page text and demo script are prepared.

The proposed listing subtitle is **Plan your UK electrician route** because the requested longer subtitle exceeds the current 30-character submission limit. The full requested wording is retained as the package description. Education is proposed; confirm the exact available category in the submission dashboard.

`plugin/plugin.json` is review metadata, not a submission-ready package. It has no invented terms or demo URL. `plugin/mcp.json` and the final submission ZIP will be generated only after real production values exist. The final ZIP will have `plugin.json`, `mcp.json`, `skills/` and `assets/` at its root, with no hooks, app references, credentials or placeholder URLs.

## Verification completed

Real MCP SDK initialization, discovery and tool calls pass. Tests cover all four tools, seven stage topics, the five positive cases, the three negative cases, main route branches, prior NVQ/AM2 awards, unknown or contradictory inputs, invalid arguments, refusal of extra personal fields, untrusted origins, allowed preflight, malformed JSON, oversized bodies and unsupported HTTP methods. Output schemas are enforced by the server. The service has no application storage or outbound tool execution.

The portable manifest and an in-memory local MCP configuration pass the official Agent Plugins JSON schemas. Listing-length, starter-prompt and review-count checks pass. Genuine logo PNG dimensions pass the square-icon checks. The package command fails closed when a required production value is missing. The locked dependency audit reports zero vulnerabilities.

These results verify the service and curated mappings, not ChatGPT’s actual tool selection, displayed answer quality, public network access, OpenAI’s scan, hosting retention or business identity. `docs/test-results.json` contains the actual local response evidence.

## Access and evidence outstanding

The connected Vercel API returned HTTP 403 for project creation in `mkwebtecindias-projects`. The CLI fallback requires device sign-in. No project was created by the connector. Complete sign-in with a hosting account authorised for the intended team; verify the resulting team and project before deployment. Do not infer that a successful sign-in alone resolves the team’s project-creation permission.

The available computer-use inventory returned no browsers or apps, and the in-app browser was unavailable. Genuine endpoint/ChatGPT screenshots and a recording could not be captured in this session. No screenshots or recordings have been fabricated. Required evidence still includes the production endpoint, ChatGPT tools, beginner result, Level 3/no-work result, metadata and final package structure.

The usual `/terms-and-conditions/`, `/terms-conditions/`, `/terms/` and `/terms-of-service/` pages returned HTTP 404 when checked. The contact and privacy pages exist, but the privacy page focuses on website/course use; confirm or extend the existing policy for the actual host’s operational data handling. No new legal policy has been published.

## Completion sequence

1. Confirm project ownership and restore hosting project-creation/deployment access.
2. Deploy the reviewed source to a stable public production HTTPS endpoint and verify no VPN/login is needed. Select and retain the approved production origin.
3. Run `npm run test:review` with `MCP_ENDPOINT` set to the production endpoint; verify from an independent network/client and review host logs without retaining input bodies.
4. Confirm the approved existing terms URL, policy coverage and support route. Review `docs/privacy-review.md`; approve changes to existing legal pages if needed.
5. Connect the production service in ChatGPT using an authenticated developer session. Run all eight prompts and the demo script, capture the requested screenshots, and host the genuine recording at an approved accessible URL.
6. Run the packaging command with the verified `MCP_ENDPOINT`, `TERMS_URL` and `DEMO_URL`. Inspect its ZIP structure and listing metadata.
7. Confirm Elec Training Ltd business identity, submission permissions, eligible/global data residency, domain verification and available category. After build/test approval, run the portal connection and automated scan; resolve findings before any public-review submission.
8. Return the complete production package and evidence to the publisher. Submit for public review only after explicit approval, as required by the brief.

## Reference documentation

- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/build/mcp-server
- https://developers.openai.com/plugins/deploy/submission
- https://www.ecscard.org.uk/content/How-do-I-become-qualified-as-an-Electrician
- https://www.netservices.org.uk/faq/

The supplied project brief is the authority for provider-specific approved facts.
