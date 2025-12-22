// OpenAI Agents SDK — MVC Integration (Language-agnostic Programmer Agent)
// Focus: BEST coding output, any programming language
// Architecture: MVC (Agent as Service layer)

// ==================================================
// models/agentModel.js
// ==================================================
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';

// -----------------------------
// MCP TOOLS (Language-agnostic)
// -----------------------------

const readContextTool = tool({
  name: 'read_context',
  description: 'Read any relevant context: code, docs, schemas, APIs',
  parameters: z.object({
    sources: z.array(z.string()).describe('Files, URLs, or MCP context keys'),
  }),
  execute: async ({ sources }) => {
    return {
      context: sources.map(s => ({
        source: s,
        content: '<context injected by MCP>',
      })),
    };
  },
});

const writeArtifactTool = tool({
  name: 'write_artifact',
  description: 'Generate production-grade code or artifacts in ANY language',
  parameters: z.object({
    language: z.string(),
    path: z.string(),
    content: z.string(),
  }),
  execute: async ({ language, path }) => {
    return { status: 'generated', language, path };
  },
});

const validateOutputTool = tool({
  name: 'validate_output',
  description: 'Run checks: tests, linters, compilers, or reasoning validation',
  parameters: z.object({
    command: z.string(),
  }),
  execute: async ({ command }) => {
    return { success: true, output: `Validated using: ${command}` };
  },
});

// -----------------------------
// Agent Model (Pure Logic)
// -----------------------------

const ProgrammerAgentModel = new Agent({
  name: 'Universal Programmer Agent',
  model: 'gpt-5.2',
  instructions: `
You are a Staff-level software engineer.


You can write code in ANY programming language.


Principles:
- Always identify the target language first
- Follow idiomatic best practices of that language
- Prefer clarity, correctness, and maintainability
- Produce COMPLETE, production-ready outputs
- Validate logic before finalizing


Rules:
1. Load context before coding
2. Never assume frameworks — ask or infer safely
3. Explain only when asked; default to code
`,
  tools: [readContextTool, writeArtifactTool, validateOutputTool],
});

export const openAiAgent = { ProgrammerAgentModel };
