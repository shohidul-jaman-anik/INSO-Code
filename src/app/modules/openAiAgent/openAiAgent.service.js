// ==================================================
// services/agentService.js
// ==================================================

import { run } from '@openai/agents';
import { openAiAgent } from './openAiAgent.agent.js';

const RunProgrammerAgent = async ({ task, targetLanguage = [] }) => {
  const input = `TARGET LANGUAGE: ${Array.isArray(targetLanguage) ? targetLanguage.join(', ') : targetLanguage}
TASK: ${task}

Please implement the above task in the specified TARGET LANGUAGE only.`;

  const result = await run(openAiAgent.ProgrammerAgentModel, input);

  console.log(result, 'result in service');
  return result;
};

export const openAiService = { RunProgrammerAgent };
