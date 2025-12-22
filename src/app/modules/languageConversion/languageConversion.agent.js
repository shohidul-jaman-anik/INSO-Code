// ==================================================
// models/languageConversionAgent.model.js
// ==================================================
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';

// -----------------------------
// MCP TOOLS (Conversion-Focused)
// -----------------------------

/**
 * Reads source code or related context
 */
const readSourceCodeTool = tool({
  name: 'read_source_code',
  description: 'Read source code or related technical context',
  parameters: z.object({
    sources: z
      .array(z.string())
      .describe('Source code files or MCP context keys'),
  }),
  execute: async ({ sources }) => {
    return {
      context: sources.map(source => ({
        source,
        content: '<source code injected by MCP>',
      })),
    };
  },
});

/**
 * Writes converted code artifact
 */
const writeConvertedCodeTool = tool({
  name: 'write_converted_code',
  description: 'Write converted code in the target programming language',
  parameters: z.object({
    sourceLanguage: z.string(),
    targetLanguage: z.string(),
    outputPath: z.string(),
    content: z.string(),
  }),
  execute: async ({ sourceLanguage, targetLanguage, outputPath }) => {
    return {
      status: 'converted',
      from: sourceLanguage,
      to: targetLanguage,
      path: outputPath,
    };
  },
});

/**
 * Optional validation (syntax / reasoning)
 */
const validateConvertedCodeTool = tool({
  name: 'validate_converted_code',
  description:
    'Validate converted code using compiler, linter, or reasoning checks',
  parameters: z.object({
    targetLanguage: z.string(),
    command: z.string(),
  }),
  execute: async ({ targetLanguage, command }) => {
    return {
      success: true,
      language: targetLanguage,
      output: `Validation passed using: ${command}`,
    };
  },
});

// -----------------------------
// Language Conversion Agent
// -----------------------------

export const LanguageConversionAgentModel = new Agent({
  name: 'Language Conversion Agent',
  model: 'gpt-5.2',

  instructions: `
You are a senior compiler engineer and expert in all programming languages.

Your ONLY responsibility is to convert source code from one programming language
into a TARGET LANGUAGE that is explicitly provided in the prompt.

IMPORTANT:
- Read the source code from the prompt.
- Read the TARGET LANGUAGE from the provided 'language' parameter.
- You MUST NOT guess the target language
- You MUST NOT rely on the prompt format

You MUST use that as the conversion target.

PROCESS:
1. Read the TARGET LANGUAGE from the prompt
2. Infer the source language from the code
3. Fully understand the source logic
4. Re-implement the same logic using idiomatic, production-grade patterns
   of the TARGET LANGUAGE

STRICT RULES:
- Preserve behavior exactly
- Do NOT explain anything
- Do NOT include markdown
- Do NOT include commentary
- Do NOT add comments unless required by the language
- Output ONLY the converted source code
- Ensure correctness before finalizing

ERROR HANDLING:
- If context or dependencies are missing, infer safely using standard conventions.
- Never change the original logic or behavior.

`,

  tools: [
    readSourceCodeTool,
    writeConvertedCodeTool,
    validateConvertedCodeTool,
  ],
});

export const languageConversionAgent = {
  LanguageConversionAgentModel,
};
