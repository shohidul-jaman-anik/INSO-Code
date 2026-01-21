// ============================================================================
// APPLICATION LAYER - Use Cases
// ============================================================================

// ApplicationLayer/analyzeProjectDocumentation.js
import fs from 'fs';
import path from 'path';
import { DocumentaitionRules } from '../DomainLayer/documentationRules.js';

const analyzeProjectDocumentation = async (projectPath, config) => {
  // This would integrate with actual file parsing
  const codeElements = await parseProject(projectPath);
  const issues = await detectDocumentationIssues(codeElements, config);

  const totalFiles = new Set(codeElements.map(e => e.filePath)).size;
  const documentedFiles = new Set(
    codeElements.filter(e => e.hasDocumentation).map(e => e.filePath),
  ).size;

  const metrics = {
    totalFiles,
    documentedFiles,
    missingDocs: issues.filter(i => i.issueType === 'missing').length,
    outdatedDocs: issues.filter(i => i.issueType === 'outdated').length,
    coveragePercentage: DocumentaitionRules.calculateCoverage(
      totalFiles,
      documentedFiles,
    ),
    issues,
  };

  metrics.qualityScore = DocumentaitionRules.calculateQualityScore(metrics);

  return {
    success: true,
    data: metrics,
    recommendations: generateRecommendations(metrics),
  };
};

const parseProject = async projectPath => {
  const codeElements = [];

  try {
    const files = getAllFiles(projectPath, ['.js', '.ts', '.jsx', '.tsx']);

    for (const filePath of files) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const elements = extractCodeElements(fileContent, filePath);
      codeElements.push(...elements);
    }
  } catch (error) {
    console.error('Error parsing project:', error.message);
  }

  return codeElements;
};

const getAllFiles = (dir, extensions = ['.js', '.ts']) => {
  const files = [];

  try {
    if (!fs.existsSync(dir)) {
      return files;
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!item.name.startsWith('.') && item.name !== 'node_modules') {
          files.push(...getAllFiles(fullPath, extensions));
        }
      } else if (item.isFile()) {
        const ext = path.extname(item.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }

  return files;
};

const extractCodeElements = (fileContent, filePath) => {
  const elements = [];

  // Regex patterns to detect functions, classes, and methods
  const functionPattern =
    /(?:^|\n)\s*(?:async\s+)?(?:export\s+)?(?:default\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(/gm;
  const classPattern = /(?:^|\n)\s*(?:export\s+)?class\s+(\w+)/gm;
  const methodPattern = /^\s*(?:async\s+)?(\w+)\s*\(/m;

  // Check for JSDoc comments
  const jsdocPattern = /\/\*\*[\s\S]*?\*\//g;
  const jsDocComments = fileContent.match(jsdocPattern) || [];

  let match;

  // Find functions
  while ((match = functionPattern.exec(fileContent)) !== null) {
    const name = match[1] || match[2];
    const startIndex = match.index;
    const hasDocumentation = hasDocumentationBefore(
      fileContent,
      startIndex,
      jsDocComments,
    );

    elements.push({
      name,
      elementType: 'function',
      filePath,
      hasDocumentation,
      isPublic: fileContent
        .substring(Math.max(0, startIndex - 50), startIndex)
        .includes('export'),
      lineNumber: fileContent.substring(0, startIndex).split('\n').length,
    });
  }

  // Find classes
  while ((match = classPattern.exec(fileContent)) !== null) {
    const name = match[1];
    const startIndex = match.index;
    const hasDocumentation = hasDocumentationBefore(
      fileContent,
      startIndex,
      jsDocComments,
    );

    elements.push({
      name,
      elementType: 'class',
      filePath,
      hasDocumentation,
      isPublic: fileContent
        .substring(Math.max(0, startIndex - 50), startIndex)
        .includes('export'),
      lineNumber: fileContent.substring(0, startIndex).split('\n').length,
    });
  }

  return elements;
};

const hasDocumentationBefore = (content, index, jsdocComments) => {
  const beforeText = content.substring(Math.max(0, index - 500), index);
  return /\/\*\*[\s\S]*?\*\//.test(beforeText) || /\/\/\s*/.test(beforeText);
};

const detectDocumentationIssues = async (codeElements, config) => {
  // Placeholder - would implement issue detection logic
  return [];
};

const generateRecommendations = metrics => {
  const recommendations = [];

  if (metrics.coveragePercentage < 70) {
    recommendations.push('Increase documentation coverage to at least 70%');
  }

  if (metrics.missingDocs > 10) {
    recommendations.push(
      `Add documentation to ${metrics.missingDocs} undocumented elements`,
    );
  }

  if (metrics.outdatedDocs > 5) {
    recommendations.push(
      `Update ${metrics.outdatedDocs} outdated documentation entries`,
    );
  }

  return recommendations;
};

export const AnalyzeProjectDocumentations = {
  analyzeProjectDocumentation,
};
