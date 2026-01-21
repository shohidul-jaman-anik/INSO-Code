// ==================================================
// services/agentService.js
// ==================================================

import { run } from '@openai/agents';

const RunDocumentationAgent = async ({ task, targetLanguage = [] }) => {
  if (!task || !targetLanguage) {
    throw new Error('task and targetLanguage are required');
  }

  const input = buildAgentInput({ task, targetLanguage });
  const result = await run(ProgrammerAgent, input);

  return result;
};

export const openAiService = { RunDocumentationAgent };
