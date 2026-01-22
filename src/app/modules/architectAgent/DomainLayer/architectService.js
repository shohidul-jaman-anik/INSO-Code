// ============================================
// modules/architectAgent/DomainLayer/architectService.js
// ============================================
import { chat } from '../InfrastructureLayer/claudeAIService.js';
import {
  createAnalyzeRequirementsPrompt,
  createAPISpecPrompt,
  createDesignDatabasePrompt,
  createEvaluateArchitecturePrompt,
  createGenerateArchitecturePrompt,
  createSuggestTechStackPrompt,
} from './prompts/architectPrompts.js';

const parseJSONResponse = response => {
  try {
    // Remove markdown code blocks
    let cleanResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Try to extract JSON from the response if it's wrapped in text
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error parsing JSON response:', error.message);
    console.error('Response preview:', response.substring(0, 500));
    throw new Error(
      `Failed to parse JSON response: ${error.message}. Response may be incomplete or malformed.`,
    );
  }
};

export const analyzeRequirements = async ({
  requirements,
  projectType,
  constraints,
}) => {
  const prompt = createAnalyzeRequirementsPrompt(
    requirements,
    projectType,
    constraints,
  );
  const response = await chat(prompt);
  return parseJSONResponse(response);
};

export const generateArchitecture = async ({
  requirements,
  projectType,
  scale,
  preferences,
}) => {
  const prompt = createGenerateArchitecturePrompt(
    requirements,
    projectType,
    scale,
    preferences,
  );
  const response = await chat(prompt);
  return parseJSONResponse(response);
};

export const suggestTechStack = async ({
  requirements,
  constraints,
  teamSkills,
}) => {
  const prompt = createSuggestTechStackPrompt(
    requirements,
    constraints,
    teamSkills,
  );
  const response = await chat(prompt);
  return parseJSONResponse(response);
};

export const designDatabase = async ({
  entities,
  relationships,
  scalability,
}) => {
  const prompt = createDesignDatabasePrompt(
    entities,
    relationships,
    scalability,
  );
  const response = await chat(prompt);
  return parseJSONResponse(response);
};

export const createAPISpecification = async ({
  features,
  architecture,
  format,
}) => {
  const prompt = createAPISpecPrompt(features, architecture, format);
  const response = await chat(prompt);
  return parseJSONResponse(response);
};

export const evaluateArchitecture = async ({ architecture, criteria }) => {
  const prompt = createEvaluateArchitecturePrompt(architecture, criteria);
  const response = await chat(prompt);
  return parseJSONResponse(response);
};
