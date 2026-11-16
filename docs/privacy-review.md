# MCP data handling review

Prepared for Elec Training Ltd on 17 November 2026. This is an internal factual implementation note for review, not a published legal policy.

The service accepts bounded categories about training, qualifications, general experience, work status and study preference. No name, email, telephone, address, date of birth, employer identity, free-text prompt, file upload or login field is defined. Strict schemas reject extra fields. The ChatGPT client should pass only these general categories.

The implementation processes inputs transiently to calculate an educational response. It has no application database, analytics, cookies, marketing SDK, email, CRM writes or outbound browsing during tool execution. It does not persist prompts, bodies, headers or tool arguments. One fixed error message can be emitted for unexpected server failures; it contains no request data.

The hosting provider can process connection metadata such as IP address, request timing, URL, HTTP status and platform diagnostics for operation and security. Retention, location, subprocessors and access depend on the chosen host and account configuration. Confirm these settings after deployment; do not promise zero personal-data processing or zero infrastructure logs. OpenAI separately handles the user's ChatGPT conversation according to its applicable terms and privacy settings.

Optional Typeform links are returned only in packaged instructions for relevant user intent. No form is opened or submitted by the service. A user's decision to visit or submit an external form starts a separate data-processing flow.

The existing https://elec.training/privacy-policy/ page is proposed as the policy URL. Its visible focus is website use and course bookings. The publisher must confirm that the policy covers this MCP service, infrastructure metadata, relevant processors, retention and optional external forms, and approve any needed addition to the existing policy. Do not publish a duplicate policy automatically.
