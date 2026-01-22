
// modules/refactoringAgent/ApplicationLayer/useCases/applyRefactoring.js
import { llmBrain } from '../../InfrastructureLayer/llm/llmBrain.js';
import * as fs from 'fs/promises';

const applyRefactoring = async (task, config = {}) => {
  try {
    // Read the file content
    const originalCode = await fs.readFile(task.filePath, 'utf-8');
    
    // Extract the section to refactor
    const lines = originalCode.split('\n');
    const sectionToRefactor = lines.slice(task.lineStart - 1, task.lineEnd).join('\n');

    // Use LLM to generate refactored code
    const result = await llmBrain.generateRefactoredCode(
      sectionToRefactor,
      [task],
      {
        filePath: task.filePath,
        language: config.language || 'javascript',
        framework: config.framework
      }
    );

    // Get explanation
    const explanation = await llmBrain.explainRefactoring(
      sectionToRefactor,
      result.refactoredCode
    );

    return {
      success: true,
      data: {
        taskId: task.id,
        status: 'completed',
        originalCode: sectionToRefactor,
        refactoredCode: result.refactoredCode,
        changes: result.changes,
        improvements: result.improvements,
        explanation: explanation,
        diff: generateDiff(sectionToRefactor, result.refactoredCode)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: {
        taskId: task.id,
        status: 'failed'
      }
    };
  }
};

const generateDiff = (original, refactored) => {
  const originalLines = original.split('\n').length;
  const refactoredLines = refactored.split('\n').length;
  
  return {
    linesAdded: Math.max(0, refactoredLines - originalLines),
    linesRemoved: Math.max(0, originalLines - refactoredLines),
    linesChanged: Math.min(originalLines, refactoredLines)
  };
};

export { applyRefactoring };
