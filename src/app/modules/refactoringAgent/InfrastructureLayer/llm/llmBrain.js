// ============================================================================
// INFRASTRUCTURE LAYER - LLM BRAIN
// ============================================================================

// modules/refactoringAgent/InfrastructureLayer/llm/llmBrain.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-api03-Jdw8N566rGd1rrlmch7qQxDj7EDS39EPqwLTAlWWZJkfCH6DqPwceSbZXCf91G_N9j8feh0veCvi_y7wgUfT2Bg-OrCRTQAA'
});

const LLM_MODEL = 'claude-sonnet-4-20250514';

// Analyze code for smells and issues
const analyzeCodeWithLLM = async (code, context = {}) => {
  try {
    const prompt = `You are an expert software architect and refactoring specialist.

Analyze the following code and identify code smells, anti-patterns, and refactoring opportunities.

CODE:
\`\`\`${context.language || 'javascript'}
${code}
\`\`\`

CONTEXT:
- File: ${context.filePath || 'unknown'}
- Language: ${context.language || 'javascript'}
- Framework: ${context.framework || 'none'}

ANALYZE FOR:
1. Code smells (long methods, duplications, complex conditionals, magic numbers)
2. Performance issues
3. Maintainability concerns
4. Security vulnerabilities in code structure
5. Modern syntax opportunities
6. SOLID principle violations

You MUST respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "codeSmells": [
    {
      "type": "long_method",
      "severity": "high",
      "lineStart": 10,
      "lineEnd": 50,
      "description": "Function exceeds 40 lines and has high complexity",
      "impact": "maintainability"
    }
  ],
  "metrics": {
    "complexity": 15,
    "maintainabilityScore": 65,
    "technicalDebtMinutes": 45
  },
  "recommendations": [
    "Extract helper functions to reduce method length",
    "Use early returns to reduce nesting"
  ]
}`;

    const message = await anthropic.messages.create({
      model: LLM_MODEL,
      max_tokens: 4096,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0].text;
    
    // Clean any markdown formatting if present
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('LLM Analysis Error:', error);
    throw new Error(`Failed to analyze code: ${error.message}`);
  }
};

// Generate refactored code
const generateRefactoredCode = async (originalCode, smells, context = {}) => {
  try {
    const smellsDescription = smells.map(s => 
      `- Line ${s.lineStart}-${s.lineEnd}: ${s.type} - ${s.description}`
    ).join('\n');

    const prompt = `You are an expert software refactoring specialist.

ORIGINAL CODE:
\`\`\`${context.language || 'javascript'}
${originalCode}
\`\`\`

IDENTIFIED ISSUES:
${smellsDescription}

REFACTORING REQUIREMENTS:
1. Fix all identified code smells and issues
2. Maintain exact functionality (no behavior changes)
3. Improve readability and maintainability
4. Use modern ${context.language || 'JavaScript'} syntax
5. Add inline comments for complex logic
6. Follow SOLID principles
7. Extract long methods into smaller functions
8. Use descriptive variable names
9. Simplify complex conditionals
10. Remove code duplication

CONSTRAINTS:
- Language: ${context.language || 'javascript'}
- Framework: ${context.framework || 'none'}
- Preserve all exports and public API
- Maintain test compatibility

You MUST respond with ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "refactoredCode": "complete refactored code as string",
  "changes": [
    {
      "type": "extract_function",
      "description": "Extracted validation logic into validateUser function",
      "lineRange": "15-25"
    }
  ],
  "improvements": {
    "complexityReduction": 40,
    "maintainabilityIncrease": 25,
    "readabilityScore": 8
  }
}`;

    const message = await anthropic.messages.create({
      model: LLM_MODEL,
      max_tokens: 8192,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0].text;
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('LLM Refactoring Error:', error);
    throw new Error(`Failed to generate refactored code: ${error.message}`);
  }
};

// Explain refactoring changes
const explainRefactoring = async (originalCode, refactoredCode) => {
  try {
    const prompt = `Compare these code versions and explain the refactoring in simple, clear terms.

ORIGINAL CODE:
\`\`\`javascript
${originalCode.substring(0, 1000)}
\`\`\`

REFACTORED CODE:
\`\`\`javascript
${refactoredCode.substring(0, 1000)}
\`\`\`

Provide a clear explanation covering:
1. Summary of changes (2-3 sentences)
2. Key improvements made
3. Why these changes improve the code
4. Any potential risks or considerations

Keep the explanation clear, concise, and understandable for developers of all levels.`;

    const message = await anthropic.messages.create({
      model: LLM_MODEL,
      max_tokens: 1024,
      temperature: 0.5,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('LLM Explanation Error:', error);
    return 'Unable to generate explanation at this time.';
  }
};

// Suggest architectural improvements
const suggestArchitecturalImprovements = async (codebase) => {
  try {
    const prompt = `You are a senior software architect. Analyze this codebase structure and suggest architectural improvements.

CODEBASE STRUCTURE:
${JSON.stringify(codebase, null, 2)}

ANALYZE AND SUGGEST:
1. Current architecture pattern identification
2. Coupling and cohesion issues
3. Separation of concerns improvements
4. Scalability recommendations
5. Testability enhancements
6. Design pattern applications
7. Module restructuring ideas
8. Dependency management improvements

Provide actionable, prioritized recommendations with clear rationale.`;

    const message = await anthropic.messages.create({
      model: LLM_MODEL,
      max_tokens: 4096,
      temperature: 0.4,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('LLM Architecture Analysis Error:', error);
    throw new Error(`Failed to analyze architecture: ${error.message}`);
  }
};

const llmBrain = {
  analyzeCodeWithLLM,
  generateRefactoredCode,
  explainRefactoring,
  suggestArchitecturalImprovements
};

export { llmBrain };
