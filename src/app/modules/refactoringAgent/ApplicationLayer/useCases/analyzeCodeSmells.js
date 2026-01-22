// ============================================================================
// APPLICATION LAYER - Use Cases with LLM
// ============================================================================

// modules/refactoringAgent/ApplicationLayer/useCases/analyzeCodeSmells.js
import { llmBrain } from '../../InfrastructureLayer/llm/llmBrain.js';
import { refactoringFactory } from '../../DomainLayer/factories/refactoringFactory.js';
import * as fs from 'fs/promises';
import * as path from 'path';

const analyzeCodeSmells = async (projectPath, config = {}) => {
  try {
    const files = await getProjectFiles(projectPath);
    const allSmells = [];
    let totalComplexity = 0;
    let totalDebtMinutes = 0;

    for (const file of files) {
      console.log(`Analyzing: ${file.path}`);
      
      const content = await fs.readFile(file.path, 'utf-8');
      
      // Use LLM to analyze the file
      const analysis = await llmBrain.analyzeCodeWithLLM(content, {
        filePath: file.path,
        language: file.language,
        framework: config.framework
      });

      // Convert LLM response to domain entities
      const fileSmells = analysis.codeSmells.map(smell =>
        refactoringFactory.createCodeSmell({
          type: smell.type,
          filePath: file.path,
          lineStart: smell.lineStart,
          lineEnd: smell.lineEnd,
          severity: smell.severity,
          description: smell.description,
          suggestedRefactoring: smell.type,
          metrics: {
            complexity: analysis.metrics.complexity,
            impact: smell.impact
          }
        })
      );

      allSmells.push(...fileSmells);
      totalComplexity += analysis.metrics.complexity || 0;
      totalDebtMinutes += analysis.metrics.technicalDebtMinutes || 0;
    }

    return {
      success: true,
      data: {
        totalSmells: allSmells.length,
        totalFiles: files.length,
        averageComplexity: (totalComplexity / files.length).toFixed(2),
        totalTechnicalDebt: totalDebtMinutes,
        byType: groupByType(allSmells),
        bySeverity: groupBySeverity(allSmells),
        smells: prioritizeByServity(allSmells)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const getProjectFiles = async (projectPath) => {
  const files = [];
  
  const readDir = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules, .git, dist, build
      if (entry.name === 'node_modules' || entry.name === '.git' || 
          entry.name === 'dist' || entry.name === 'build') {
        continue;
      }
      
      if (entry.isDirectory()) {
        await readDir(fullPath);
      } else if (entry.isFile()) {
        // Only analyze code files
        if (/\.(js|jsx|ts|tsx|py|java|go|rb)$/.test(entry.name)) {
          files.push({
            path: fullPath,
            name: entry.name,
            language: getLanguage(entry.name)
          });
        }
      }
    }
  };
  
  await readDir(projectPath);
  return files;
};

const getLanguage = (filename) => {
  const ext = path.extname(filename);
  const langMap = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.go': 'go',
    '.rb': 'ruby'
  };
  return langMap[ext] || 'javascript';
};

const groupByType = (smells) => {
  return smells.reduce((acc, smell) => {
    if (!acc[smell.type]) acc[smell.type] = [];
    acc[smell.type].push(smell);
    return acc;
  }, {});
};

const groupBySeverity = (smells) => {
  return smells.reduce((acc, smell) => {
    if (!acc[smell.severity]) acc[smell.severity] = 0;
    acc[smell.severity]++;
    return acc;
  }, {});
};

const prioritizeByServity = (smells) => {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...smells].sort((a, b) => order[a.severity] - order[b.severity]);
};

export { analyzeCodeSmells };