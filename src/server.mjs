import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { VERSION } from './facts.mjs';
import { getElectricianRoute, explainElectricalStage, checkNvqProgression, compareElectricianRoutes } from './guidance.mjs';

export const qualification = z.enum(['none', 'level_2_technical', 'level_3_technical', '18th_edition', 'level_3_nvq', 'am2', 'other_or_overseas', 'unsure']);
const experience = z.enum(['none', 'some', 'currently_working', 'significant_experience', 'unsure']);
const annotations = { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true };
const source = z.object({ title: z.string(), url: z.string().optional(), date: z.string().optional(), provenance: z.string().optional() });
const support = z.object({ general: z.string(), guarantee: z.string(), limits: z.string(), fees: z.string() });
const common = { fact_base_date: z.string(), scope: z.string(), important_caveats: z.array(z.string()), sources: z.array(source) };
export const tools = [
  { name: 'get_electrician_route', title: 'Find your likely electrician route', description: 'Explain a likely adult UK electrician training route from general qualifications and work experience. Use for beginners, after Level 2 or technical Level 3, or existing electrical work. Do not send personal details. This does not assess competence or award eligibility.',
    inputSchema: z.object({ starting_point: z.enum(['complete_beginner', 'level_2_completed', 'level_3_completed', 'already_working_electrical', 'construction_or_other_trade', 'unsure']), existing_qualifications: z.array(qualification).max(8).default([]), electrical_work_experience: experience.default('unsure'), currently_working_in_electrical: z.boolean().nullable().default(null), study_preference: z.enum(['full_time', 'blended', 'flexible', 'unsure']).default('unsure'), jurisdiction: z.enum(['england', 'scotland', 'wales', 'northern_ireland', 'unsure']).default('unsure') }).strict(),
    outputSchema: z.object({ ...common, current_stage: z.string(), likely_next_step: z.string(), high_level_route: z.array(z.string()), explanation: z.string(), workplace_requirement: z.string(), later_assessment_information: z.string(), questions_to_resolve: z.array(z.string()), study_options: z.string(), provider_support: support.optional() }), run: getElectricianRoute },
  { name: 'explain_electrical_stage', title: 'Explain an electrical qualification stage', description: 'Explain Level 2, Level 3 technical diplomas, 18th Edition, Level 3 NVQ, workplace evidence, external AM2 or ECS Gold Card requirements. Use for questions about what a stage does and does not prove, whether Level 3 makes someone fully qualified, AM2 at Elec Training, or who qualifies for NVQ placement support.',
    inputSchema: z.object({ topic: z.enum(['Level 2', 'Level 3', '18th Edition', 'Level 3 NVQ', 'workplace evidence', 'AM2', 'ECS Gold Card']) }).strict(),
    outputSchema: z.object({ ...common, topic: z.string(), what_it_is: z.string(), what_it_does: z.string(), what_it_does_not_prove: z.string(), where_it_fits: z.string(), likely_next_stage: z.string(), external_assessment: z.string().optional(), provider_support: support.optional() }), run: explainElectricalStage },
  { name: 'check_nvq_progression', title: 'Check likely NVQ workplace progression', description: 'Explain likely workplace evidence needs and next steps for electrical NVQ progression, including learners without suitable electrical work and electrician’s mates. Explains the limited Elec Training placement guarantee and separately charged support where relevant. Do not send personal or employer details.',
    inputSchema: z.object({ technical_training_stage: z.enum(['none', 'level_2', 'level_3_technical', 'other_or_overseas', 'unsure']), currently_working_in_electrical: z.boolean().nullable().default(null), workplace_experience: experience.default('unsure'), existing_nvq_progress: z.enum(['not_started', 'in_progress', 'evidence_gaps', 'completed', 'unsure']).default('unsure') }).strict(),
    outputSchema: z.object({ ...common, current_position: z.string(), workplace_evidence_likely_required: z.boolean(), workplace_requirement: z.string(), assessment_process: z.string(), possible_next_steps: z.array(z.string()), experience_context: z.string(), provider_support: support.optional() }), run: checkNvqProgression },
  { name: 'compare_electrician_routes', title: 'Compare electrician training routes', description: 'Compare apprenticeship, college, T Level and private adult routes by employment, flexibility, technical study and workplace competence. Use when an adult asks whether they can qualify without an apprenticeship. No route is universally best.',
    inputSchema: z.object({ routes: z.array(z.enum(['apprenticeship', 'college', 't_level', 'private_adult_training'])).max(4).optional() }).strict(),
    outputSchema: z.object({ ...common, conclusion: z.string(), routes: z.array(z.object({ route: z.string(), typical_learner: z.string(), employment_dependency: z.string(), flexibility: z.string(), technical_training: z.string(), workplace_competence: z.string(), adult_suitability: z.string(), limitations: z.string() })), adult_non_apprenticeship_route: z.array(z.string()), later_assessment_information: z.string(), decision_factors: z.array(z.string()) }), run: compareElectricianRoutes }
];

export function createServer() {
  const server = new McpServer({ name: 'electrician-route-checker', version: VERSION }, { instructions: 'Provide high-level educational guidance. Technical diplomas do not prove occupational competence. Never broaden the limited NVQ placement guarantee or include placement support in the base fee. AM2 is external; Elec Training does not deliver it. Send only general enum-based training information; no personal details. Use the tool evidence and caveats, with no automatic claim of qualification or ECS eligibility.' });
  for (const t of tools) server.registerTool(t.name, { title: t.title, description: t.description, inputSchema: t.inputSchema, outputSchema: t.outputSchema, annotations }, async args => {
    const result = t.outputSchema.parse(t.run(args));
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  });
  return server;
}
