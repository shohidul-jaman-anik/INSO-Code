// ==================================================
// services/agentService.js
// ==================================================

import { run } from '@openai/agents';
import { languageConversionAgent } from './languageConversion.agent.js';

const RunProgrammerAgent = async ({ prompt, language }) => {
  // Explicitly tell the agent the target language
  const enrichedPrompt = `
    TARGET LANGUAGE: ${language}
    SOURCE CODE: ${prompt}
`;

  const result = await run(
    languageConversionAgent.LanguageConversionAgentModel,
    enrichedPrompt,
  );

  console.log(result, 'result in service');
  return result;
};

export const languageConvAgentService = { RunProgrammerAgent };
