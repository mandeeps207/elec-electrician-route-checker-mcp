# Electrician Route Checker build review

Prepared for Elec Training Ltd on 17 November 2026. **Ready for submission: NO.** No OpenAI draft has been uploaded, scanned, submitted or published.

The four-tool MCP service is live on Vercel and passes local and public unauthenticated MCP protocol and guidance checks. The working GitHub repository is private. The final submission ZIP is deliberately withheld until approved terms and recording URLs are supplied and verified and the remaining release checks are complete.

## Requested status

| Item | Result |
| --- | --- |
| MCP production URL | https://elec-electrician-route-checker.vercel.app/mcp |
| GitHub repository | https://github.com/mandeeps207/elec-electrician-route-checker-mcp — private |
| Hosting platform | Vercel — mkwebtecindias-projects / elec-electrician-route-checker — production READY |
| Tool 1 get_electrician_route | PASS locally and on production through an unauthenticated MCP SDK client |
| Tool 2 explain_electrical_stage | PASS locally and on production; all seven topics additionally checked locally |
| Tool 3 check_nvq_progression | PASS locally and on production through an unauthenticated MCP SDK client |
| Tool 4 compare_electrician_routes | PASS locally and on production through an unauthenticated MCP SDK client |
| Website URL | https://elec.training/ |
| Support URL | https://elec.training/contact-us/ — proposed existing contact page |
| Privacy URL | https://elec.training/privacy-policy/ — selected and approved for use by the user on 19 November 2026; already set in package metadata |
| Terms URL | No suitable approved working URL verified; publisher input required |
| Five positive tests | 5/5 PASS locally and on production at the mapped MCP tool-response layer; four ChatGPT answer cases PASS; Level 3/no-site-experience tool use unverified; electrician's mate case pending |
| Three negative tests | 3/3 PASS locally and on production at the mapped MCP tool-response layer; all three ChatGPT answers PASS with plugin activity observed; raw tool names and arguments not exposed in screenshots |
| Demo URL | Not recorded; manual ChatGPT testing has started; script prepared |
| OpenAI automated scan | NOT RUN |
| Ready for submission | NO |

## Build contents

Runtime code, dependency lockfile, Vercel configuration, development instructions, exact tool schemas, MCP acceptance tests, eight exact review cases, official-logo source and padded icon assets, draft portable metadata, packaged skill instructions, release notes, privacy implementation note, support-page text and demo script are prepared.

The proposed listing subtitle is **Plan your UK electrician route** because the requested longer subtitle exceeds the current 30-character submission limit. The full requested wording is retained as the package description. Education is proposed; confirm the exact available category in the submission dashboard.

`plugin/plugin.json` is review metadata, not a submission-ready package. It has no invented terms or demo URL. `plugin/mcp.json` contains the working stable production endpoint. The final submission ZIP will be generated after the approved remaining URLs exist. It will have `plugin.json`, `mcp.json`, `skills/` and `assets/` at its root, with no hooks, app references, credentials or placeholder URLs.

## Verification completed

Real MCP SDK initialization, discovery and tool calls pass. Tests cover all four tools, seven stage topics, the five positive cases, the three negative cases, main route branches, prior NVQ/AM2 awards, unknown or contradictory inputs, invalid arguments, refusal of extra personal fields, untrusted origins, allowed preflight, malformed JSON, oversized bodies and unsupported HTTP methods. Output schemas are enforced by the server. The service has no application storage or outbound tool execution.

The portable manifest and an in-memory local MCP configuration pass the official Agent Plugins JSON schemas. Listing-length, starter-prompt and review-count checks pass. Genuine logo PNG dimensions pass the square-icon checks. The package command fails closed when a required production value is missing. The locked dependency audit reports zero vulnerabilities.

Production deployment `dpl_BrnidUuXTVTh56oUVW3BdNVMpQae` is READY, targeting production. Its source runtime was deployed from commit `970348a`. The stable alias serves the information page with HTTP 200 and accepts unauthenticated MCP initialization, discovery and calls. A browser-style GET to `/mcp` correctly returns HTTP 405 because the stateless transport requires POST. The remote review run passed all eight cases through the public HTTPS alias without cookies, credentials or a protection bypass. The independent web-reader could not open this new URL, so validation from a second network/client remains pending.

The post-deployment Vercel error-log query returned no logs. This is not proof of comprehensive monitoring; confirm infrastructure logging and retention before submission.

These results verify the service, public client access from the development network and curated mappings, not ChatGPT’s actual tool selection, displayed answer quality, OpenAI’s scan, hosting retention or business identity. `docs/test-results.json` contains local response evidence and `docs/production-test-results.json` contains the public endpoint results.

Manual ChatGPT testing has since started using screenshots provided by the user. The first beginner response passes the expected content checks and expanded activity visibly shows plugin invocation. The raw tool name and arguments are not exposed in that screenshot. See `docs/chatgpt-test-results.md` for the evidence and remaining cases. The private test listing currently shows an individual developer name, Other category and no website/description; correct the listing and verified publisher identity before submission.

Following tool refresh and successful AM2 and placement-guarantee turns, the user confirmed that the availability popup is no longer appearing. It is not currently reproducing; its root cause was not established. No server fix is claimed.

## Access and evidence outstanding

The project owners are confirmed: GitHub `mandeeps207` and Vercel `mkwebtecindias-projects`. The connected Vercel API initially returned HTTP 403 for project creation. The CLI fallback succeeded after user device sign-in. The CLI identity, exact team and project were verified before deployment. Project ID: `prj_LqzZ1wZc1vZ0viV1TmFQm8orbHp1`. No credentials are committed or included in the review archive. The project is deployed manually; no automatic Git release integration has been enabled.

The available computer-use inventory returned no browsers or apps, and the in-app browser was unavailable. Genuine endpoint/ChatGPT screenshots and a recording could not be captured in this session. No screenshots or recordings have been fabricated. Required evidence still includes the production endpoint, ChatGPT tools, beginner result, Level 3/no-work result, metadata and final package structure.

The usual `/terms-and-conditions/`, `/terms-conditions/`, `/terms/` and `/terms-of-service/` pages returned HTTP 404 when checked. The contact and privacy pages exist, but the privacy page focuses on website/course use; confirm or extend the existing policy for the actual host’s operational data handling. No new legal policy has been published.

On 19 November 2026 the user instructed use of https://elec.training/privacy-policy/ as the privacy-policy URL. That URL is already configured in the portable metadata and package builder. This records the user's URL selection; no legal text was changed and it does not independently establish policy coverage. The latest user screenshot confirms the installed connection uses the stable production `/mcp` URL, authentication supported/used None, version 1.0.0 and review status DEVELOPMENT. Its developer is still shown as mandeep singh. Refresh tools and app-description editing controls are available in the shown settings page; no refresh outcome is yet observed.

## Completion sequence

1. Completed: confirm project ownership and restore hosting access.
2. Completed: deploy the service to the stable public production endpoint and verify unauthenticated MCP access. Retain this origin; complete domain verification during authorised portal setup.
3. Production review cases pass. Still verify from an independent network/client and confirm host retention settings without retaining input bodies.
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
