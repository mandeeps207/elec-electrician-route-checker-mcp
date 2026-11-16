# ChatGPT test evidence

Manual evaluation using screenshots supplied by the user in this conversation. Screenshot files and raw tool-call traces have not been saved locally. This evidence is separate from automated MCP client tests.

## Private connection

The user supplied a ChatGPT plugin page showing Electrician Route Checker, version 1.0.0, and a Try in chat button. The page showed developer mandeep singh, category Other, website Unavailable and no app description. These listing fields need review before submission; the publisher identity must be Elec Training Ltd under its verified publishing identity.

## Positive case 1

Prompt: I'm 35, have no electrical qualifications and want to become an electrician. Where do I start?

Answer content: PASS. The complete visible answer recognises an adult beginner, gives an employed apprenticeship or adult Level 2 entry option, explains Level 3 technical training, suitable electrical work, Level 3 NVQ, 18th Edition if required, external AM2 and conditional ECS Gold Card progression. It explicitly says technical diplomas alone do not make someone fully qualified, notes that study and workplace experience can overlap, states Elec Training does not deliver AM2, and asks about country and study around a current job. No error is visible.

Plugin invocation: OBSERVED. Expanded Worked for 11s activity shows the Elec Training icon with the activity label Explaining the UK Electrician Training Route. This establishes visible plugin activity but does not expose the raw MCP tool name, input arguments or returned payload. The expected tool remains get_electrician_route; exact tool identity and arguments are not independently verified from this screenshot.

## Remaining cases

Positive cases 2, 4 and 5 and negative cases 1 to 3: NOT YET OBSERVED in ChatGPT. Their automated production MCP client checks already pass, but those results do not replace ChatGPT answer and tool-selection evidence.

Next requested prompt: I've completed Level 3 but I don't have electrical site experience. What should I do?

Expected behaviour: explain that technical Level 3 alone does not establish occupational competence, identify suitable real work and workplace-based NVQ progression, describe later external assessment, and preserve the narrow Level 3 NVQ placement guarantee and separate support charges if Elec Training support is mentioned. Confirm the exact Level 3 award where necessary.

## Positive case 3 and reported availability alert

The user supplied a screenshot of the Level 3/no-site-experience answer. Answer content: PASS. It distinguishes a technical diploma from occupational competence, recommends suitable supervised work and an assessor-led NVQ evidence plan, checks exact qualification details, rejects job title or workshop exercises as sufficient evidence, identifies external NET assessment, and preserves the restricted paid-placement guarantee and separately charged support. It does not promise permanent employment or paid work for every learner. Expanded tool activity for this turn has not yet been supplied.

The user also reported a popup saying some tools are temporarily unavailable. The popup itself is not visible in the supplied screenshot. Connection reliability remains unresolved; correct answer text does not demonstrate that the tool call succeeded on this turn.

Diagnostic rerun: the public production MCP client review again passed all five positive and three negative cases. Requests including Origin https://chatgpt.com returned HTTP 200 for initialization (432 ms) and tools/list (306 ms), discovering four tools with no protocol error. Vercel's error-log query returned no logs, which does not exclude every infrastructure or client-side problem. The OpenAI status page reported operational status at the time checked; aggregate status cannot exclude account/session-specific issues. No server change was made on the basis of the generic alert. Ask for the expanded Worked for 8s activity and exact popup details before assigning a cause.

## Outstanding evidence

Record the remaining seven ChatGPT cases, the required genuine production walkthrough and its accessible URL. A user-operated Chrome session is available, but this VS Code session has no connected browser-control surface. Continue guided manual testing unless a supported browser-control connection becomes available. No desktop-app installation is required for the user to perform manual ChatGPT web tests.
