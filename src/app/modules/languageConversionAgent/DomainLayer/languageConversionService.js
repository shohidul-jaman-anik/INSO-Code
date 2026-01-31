// ============================================
// modules/languageConversionAgent/DomainLayer/languageConversionService.js
// ============================================
import { chat } from '../InfrastructureLayer/claudeAIService.js';
import {
  createAnalyzeCompatibilityPrompt,
  createConvertAndOptimizePrompt,
  createConvertCodePrompt,
  createConvertWithContextPrompt,
  createMigrationPlanPrompt,
} from './prompts/languageConversionPrompts.js';

const parseJSONResponse = response => {
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

export const convertCode = async ({
  code,
  sourceLanguage,
  targetLanguage,
  preserveComments,
}) => {
  const prompt = createConvertCodePrompt(
    code,
    sourceLanguage,
    targetLanguage,
    preserveComments,
  );
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

export const convertWithContext = async ({
  code,
  sourceLanguage,
  targetLanguage,
  dependencies,
  framework,
  context,
}) => {
  const prompt = createConvertWithContextPrompt(
    code,
    sourceLanguage,
    targetLanguage,
    dependencies,
    framework,
    context,
  );
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

export const batchConvert = async ({
  files,
  sourceLanguage,
  targetLanguage,
  maintainStructure,
}) => {
  const results = [];

  for (const file of files) {
    const prompt = createConvertCodePrompt(
      file.code,
      sourceLanguage,
      targetLanguage,
      true,
    );
    const response = await chat(prompt, { maxTokens: 8000 });
    const converted = parseJSONResponse(response);

    results.push({
      originalFile: file.name,
      convertedFile: file.name.replace(
        getFileExtension(sourceLanguage),
        getFileExtension(targetLanguage),
      ),
      ...converted,
    });
  }

  return {
    totalFiles: files.length,
    conversions: results,
    maintainedStructure: maintainStructure,
  };
};

export const analyzeCompatibility = async ({
  code,
  sourceLanguage,
  targetLanguage,
}) => {
  const prompt = createAnalyzeCompatibilityPrompt(
    code,
    sourceLanguage,
    targetLanguage,
  );
  const response = await chat(prompt, { maxTokens: 6000 });
  return parseJSONResponse(response);
};

export const generateMigrationPlan = async ({
  projectStructure,
  sourceLanguage,
  targetLanguage,
  complexity,
}) => {
  const prompt = createMigrationPlanPrompt(
    projectStructure,
    sourceLanguage,
    targetLanguage,
    complexity,
  );
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

export const convertAndOptimize = async ({
  code,
  sourceLanguage,
  targetLanguage,
  optimizationGoals,
}) => {
  const prompt = createConvertAndOptimizePrompt(
    code,
    sourceLanguage,
    targetLanguage,
    optimizationGoals,
  );
  const response = await chat(prompt, { maxTokens: 8000 });
  return parseJSONResponse(response);
};

const getFileExtension = language => {
  const extensions = {
    javascript: '.js',
    typescript: '.ts',
    python: '.py',
    java: '.java',
    csharp: '.cs',
    go: '.go',
    rust: '.rs',
    php: '.php',
    ruby: '.rb',
    kotlin: '.kt',
    swift: '.swift',
    cpp: '.cpp',
    c: '.c',
  };
  return extensions[language.toLowerCase()] || '.txt';
};
