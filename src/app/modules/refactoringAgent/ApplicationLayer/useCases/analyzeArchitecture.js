// modules/refactoringAgent/ApplicationLayer/useCases/analyzeArchitecture.js
import * as fs from 'fs/promises';
import * as path from 'path';
import { llmBrain } from '../../InfrastructureLayer/llm/llmBrain.js';

const analyzeArchitecture = async projectPath => {
  try {
    // Build codebase structure
    const structure = await buildCodebaseStructure(projectPath);

    // Use LLM for architectural analysis
    const suggestions =
      await llmBrain.suggestArchitecturalImprovements(structure);

    return {
      success: true,
      data: {
        structure,
        suggestions,
        analyzedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const buildCodebaseStructure = async projectPath => {
  const structure = {
    modules: [],
    dependencies: {},
    fileCount: 0,
    totalLines: 0,
  };

  const readDir = async (dir, relativePath = '') => {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;

      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        structure.modules.push({
          name: entry.name,
          path: relPath,
          type: 'directory',
        });
        await readDir(fullPath, relPath);
      } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const lines = content.split('\n').length;

        structure.fileCount++;
        structure.totalLines += lines;

        structure.modules.push({
          name: entry.name,
          path: relPath,
          type: 'file',
          lines: lines,
        });
      }
    }
  };

  await readDir(projectPath);
  return structure;
};

export { analyzeArchitecture };
