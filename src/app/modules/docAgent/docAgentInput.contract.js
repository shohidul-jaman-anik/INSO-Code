export function buildAgentInput({ task, targetLanguage }) {
  const language = Array.isArray(targetLanguage)
    ? targetLanguage.join(', ')
    : targetLanguage;

  return `TARGET LANGUAGE: ${language}
TASK: ${task}

Please implement the above task in the specified TARGET LANGUAGE only.`;
}