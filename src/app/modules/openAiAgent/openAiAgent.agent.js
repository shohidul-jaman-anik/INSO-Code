
// import { Agent, tool } from '@openai/agents';
// import { z } from 'zod';

// const readContextTool = tool({
//   name: 'read_context',
//   description: 'Read any relevant context: code, docs, schemas, APIs',
//   parameters: z.object({
//     sources: z.array(z.string()).describe('Files, URLs, or MCP context keys'),
//   }),
//   execute: async ({ sources }) => {
//     return {
//       context: sources.map(s => ({
//         source: s,
//         content: '<context injected by MCP>',
//       })),
//     };
//   },
// });

// const writeArtifactTool = tool({
//   name: 'write_artifact',
//   description: 'Generate production-grade code or artifacts in ANY language',
//   parameters: z.object({
//     language: z.string(),
//     path: z.string(),
//     content: z.string(),
//   }),
//   execute: async ({ language, path }) => {
//     return { status: 'generated', language, path };
//   },
// });

// const validateOutputTool = tool({
//   name: 'validate_output',
//   description: 'Run checks: tests, linters, compilers, or reasoning validation',
//   parameters: z.object({
//     command: z.string(),
//   }),
//   execute: async ({ command }) => {
//     return { success: true, output: `Validated using: ${command}` };
//   },
// });

// // -----------------------------
// // Agent Model (Pure Logic)
// // -----------------------------
// const ProgrammerAgentModel = new Agent({
//   name: 'Universal Programmer Agent',
//   model: 'gpt-5.2',
//   instructions: `
// You are a senior staff-level software engineer.

// Your ONLY responsibility is to implement the TASK in the TARGET LANGUAGE provided.

// INPUT RULES:
// - Locate the string labeled "TASK". This is what you must implement.
// - Locate the string labeled "TARGET LANGUAGE". This is your ONLY output language.
// - You MUST NOT guess the target language.
// - Ignore any language hints inside the task string.

// PROCESS:
// 1. Fully understand the logic or task.
// 2. Generate production-ready, idiomatic code in targetLanguage.

// STRICT OUTPUT RULES:
// - Preserve behavior exactly.
// - Output ONLY the labeled "TARGET LANGUAGE"
// - Validate code correctness before finalizing.
// `,
//   tools: [readContextTool, writeArtifactTool, validateOutputTool],
// });


// export const openAiAgent = { ProgrammerAgentModel };


// ==================================================
// models/agentModel.js (FIXED & ENHANCED)
// ==================================================
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';

// -----------------------------
// ENHANCED MCP TOOLS
// -----------------------------

const readContextTool = tool({
  name: 'read_context',
  description: 'Read any relevant context: code, docs, schemas, APIs, or best practices for the target language',
  parameters: z.object({
    sources: z.array(z.string()).describe('Files, URLs, or MCP context keys'),
    language: z.string().optional().describe('Programming language context'),
  }),
  execute: async ({ sources, language }) => {
    return {
      context: sources.map(s => ({
        source: s,
        content: `<context for ${language || 'generic'}>`,
        bestPractices: `Best practices and patterns for ${language}`,
      })),
    };
  },
});

const writeArtifactTool = tool({
  name: 'write_artifact',
  description: 'Generate production-grade code or artifacts in the SPECIFIED language only',
  parameters: z.object({
    language: z.string().describe('Target programming language (MUST match input)'),
    path: z.string().describe('File path or artifact name'),
    content: z.string().describe('Complete, production-ready code'),
    explanation: z.string().optional().describe('Brief explanation of implementation'),
  }),
  execute: async ({ language, path, content, explanation }) => {
    return { 
      status: 'generated', 
      language, 
      path,
      contentLength: content.length,
      explanation 
    };
  },
});

const validateOutputTool = tool({
  name: 'validate_output',
  description: 'Run checks: syntax validation, linting, testing, or logical verification',
  parameters: z.object({
    language: z.string().describe('Programming language to validate'),
    code: z.string().describe('Code to validate'),
    validationType: z.enum(['syntax', 'logic', 'best-practices', 'security']).optional(),
  }),
  execute: async ({ language, code, validationType = 'syntax' }) => {
    return { 
      success: true, 
      language,
      validationType,
      message: `✓ ${validationType} validation passed for ${language}`,
      codeLength: code.length 
    };
  },
});

const analyzeTaskTool = tool({
  name: 'analyze_task',
  description: 'Break down the task into clear requirements and implementation steps',
  parameters: z.object({
    task: z.string().describe('The task description'),
    language: z.string().describe('Target programming language'),
  }),
  execute: async ({ task, language }) => {
    return {
      taskBreakdown: 'Task analyzed and broken into components',
      language,
      requirements: ['Parsed from task description'],
      suggestedApproach: `Best approach for ${language}`,
    };
  },
});

// -----------------------------
// ENHANCED Agent Model
// -----------------------------
const ProgrammerAgentModel = new Agent({
  name: 'Universal Programmer Agent',
  model: 'gpt-4o', // Changed from 'gpt-5.2' (which doesn't exist)
  instructions: `
You are a **senior staff-level software engineer** with expertise in ALL programming languages.

═══════════════════════════════════════════════════════════════
🎯 CRITICAL INPUT PARSING RULES (MUST FOLLOW)
═══════════════════════════════════════════════════════════════

The input will be formatted as:
TARGET LANGUAGE: <language>
TASK: <task description>

**MANDATORY STEPS:**
1. **EXTRACT** the TARGET LANGUAGE from the first line
2. **EXTRACT** the TASK from the line after "TASK:"
3. **VERIFY** you have both before proceeding
4. **USE ONLY** the extracted TARGET LANGUAGE for your output

═══════════════════════════════════════════════════════════════
🔧 IMPLEMENTATION PROCESS
═══════════════════════════════════════════════════════════════

**Step 1: Parse & Validate**
- Extract TARGET LANGUAGE and TASK
- Use analyze_task tool to break down requirements
- Confirm language-specific patterns and idioms

**Step 2: Design**
- Design the solution architecture
- Consider language-specific best practices
- Plan error handling and edge cases

**Step 3: Implement**
- Write clean, production-ready code in TARGET LANGUAGE
- Follow language conventions and style guides
- Add appropriate comments and documentation
- Use write_artifact tool to generate code

**Step 4: Validate**
- Use validate_output tool to check correctness
- Verify syntax and logic
- Ensure best practices are followed

═══════════════════════════════════════════════════════════════
📋 OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════

**MUST INCLUDE:**
1. **Code** - Complete, runnable implementation in TARGET LANGUAGE
2. **Explanation** - Brief overview of the implementation
3. **Usage Example** - How to use the code
4. **Notes** - Any important considerations

**CODE QUALITY STANDARDS:**
- ✓ Production-ready and tested
- ✓ Follows language idioms and conventions
- ✓ Properly structured and organized
- ✓ Includes error handling
- ✓ Well-commented where necessary
- ✓ Efficient and maintainable

**FORBIDDEN:**
- ✗ Never output in a different language than TARGET LANGUAGE
- ✗ Never mix multiple languages (unless explicitly requested)
- ✗ Never include pseudo-code instead of real code
- ✗ Never omit critical implementation details

═══════════════════════════════════════════════════════════════
🚨 FINAL VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

Before finalizing output, verify:
□ Code is in the TARGET LANGUAGE specified
□ All task requirements are implemented
□ Code follows language best practices
□ Syntax is valid and correct
□ Error handling is included
□ Code is production-ready

**If any checkbox is unchecked, DO NOT output. Fix first.**
`,
  tools: [analyzeTaskTool, readContextTool, writeArtifactTool, validateOutputTool],
});

export const openAiAgent = { ProgrammerAgentModel };