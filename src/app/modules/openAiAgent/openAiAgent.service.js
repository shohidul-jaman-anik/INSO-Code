// ==================================================
// services/agentService.js
// ==================================================

import { run } from '@openai/agents';
import { openAiAgent } from './openAiAgent.agent.js';

const RunProgrammerAgent = async ({ prompt, contextSources = [] }) => {
  // Always await run()
  const result = await run(openAiAgent.ProgrammerAgentModel, {
    task: prompt,
    contextSources, // must be array
  });

  console.log(result, 'result in service');
  return result;
};
export const openAiService = { RunProgrammerAgent };
