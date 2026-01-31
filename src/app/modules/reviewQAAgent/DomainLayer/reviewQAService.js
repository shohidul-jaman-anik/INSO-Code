// ============================================
// modules/reviewQAAgent/DomainLayer/reviewQAService.js
// ============================================
import { chat } from '../InfrastructureLayer/claudeAIService.js';
import {
  createCodeReviewPrompt,
  createPerformanceAnalysisPrompt,
  createBestPracticesPrompt,
  createFullQAReportPrompt,
  createArchitectureReviewPrompt,
  createComplianceCheckPrompt
} from './prompts/reviewQAPrompts.js';

const parseJSONResponse = (response) => {
  try {
    const cleanResponse = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    return { raw: response };
  }
};

export const performCodeReview = async ({ code, language, focusAreas }) => {
  const prompt = createCodeReviewPrompt(code, language, focusAreas);
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

export const analyzePerformance = async ({ code, language, expectedLoad }) => {
  const prompt = createPerformanceAnalysisPrompt(code, language, expectedLoad);
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

export const reviewBestPractices = async ({ code, language, standards }) => {
  const prompt = createBestPracticesPrompt(code, language, standards);
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

export const generateFullQAReport = async ({ code, language, projectContext, testCode }) => {
  const prompt = createFullQAReportPrompt(code, language, projectContext, testCode);
  const response = await chat(prompt, { maxTokens: 12000 });
  return parseJSONResponse(response);
};

export const reviewArchitecture = async ({ codeStructure, language, architectureType }) => {
  const prompt = createArchitectureReviewPrompt(codeStructure, language, architectureType);
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

export const checkCompliance = async ({ code, language, standards, industry }) => {
  const prompt = createComplianceCheckPrompt(code, language, standards, industry);
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};
