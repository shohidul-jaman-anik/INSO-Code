// ============================================
// modules/languageConversionAgent/InfrastructureLayer/claudeAIService.js
// ============================================
const getAPIKey = () => process.env.ANTHROPIC_API_KEY;
const getBaseURL = () => 'https://api.anthropic.com/v1/messages';
const getModel = () => 'claude-sonnet-4-20250514';

export const chat = async (prompt, options = {}) => {
  const apiKey = getAPIKey();

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const response = await fetch(getBaseURL(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: options.model || getModel(),
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.5,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Claude AI Error: ${error.error?.message || 'Unknown error'}`,
    );
  }

  const data = await response.json();
  return data.content[0].text;
};
