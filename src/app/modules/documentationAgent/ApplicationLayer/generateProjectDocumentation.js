// ============================================================================
// APPLICATION LAYER - Generate Documentation for Entire Project
// ============================================================================

import fs from 'fs';
import path from 'path';
import { AnalyzeProjectDocumentations } from './analyzeProjectDocumentation.js';
import { GenerateDocumentations } from './generateDocumentation.js';

const generateProjectDocumentation = async (projectPath, config) => {
  try {
    // Step 1: Analyze the project to extract all code elements
    const analysisResult =
      await AnalyzeProjectDocumentations.analyzeProjectDocumentation(
        projectPath,
        config,
      );

    if (!analysisResult.success) {
      return {
        success: false,
        error: 'Failed to analyze project',
      };
    }

    // Step 2: Extract undocumented code elements
    const codeElements = await extractUndocumentedElements(projectPath);

    // Step 3: Generate documentation for all undocumented elements
    const generationResult = await GenerateDocumentations.generateDocumentation(
      codeElements,
      config,
    );

    // Step 4: Save documentation to files if requested
    if (config.saveToFiles) {
      await saveDocumentationToFiles(
        generationResult.data.documents,
        projectPath,
        config,
      );
    }

    return {
      success: true,
      data: {
        analysis: analysisResult.data,
        documentation: generationResult.data,
        totalGenerated: generationResult.data.generated,
        recommendations: analysisResult.recommendations,
      },
    };
  } catch (error) {
    console.error('Error generating project documentation:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const extractUndocumentedElements = async projectPath => {
  const codeElements = [];

  try {
    const files = getAllFiles(projectPath, ['.js', '.ts', '.jsx', '.tsx']);

    for (const filePath of files) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const elements = extractCodeElements(fileContent, filePath);

      // Only add undocumented elements
      const undocumented = elements.filter(e => !e.hasDocumentation);
      codeElements.push(...undocumented);
    }
  } catch (error) {
    console.error('Error extracting undocumented elements:', error.message);
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

  const functionPattern =
    /(?:^|\n)\s*(?:async\s+)?(?:export\s+)?(?:default\s+)?function\s+(\w+)\s*\(([^)]*)\)|const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)/gm;
  const classPattern = /(?:^|\n)\s*(?:export\s+)?class\s+(\w+)/gm;

  const jsdocPattern = /\/\*\*[\s\S]*?\*\//g;
  const jsDocComments = fileContent.match(jsdocPattern) || [];

  let match;

  // Find functions
  while ((match = functionPattern.exec(fileContent)) !== null) {
    const name = match[1] || match[3];
    const params = match[2] || match[4] || '';
    const startIndex = match.index;
    const hasDocumentation = hasDocumentationBefore(
      fileContent,
      startIndex,
      jsDocComments,
    );

    const parameters = extractParameters(params);
    const returnType = extractReturnType(fileContent, startIndex);

    elements.push({
      name,
      elementType: 'function',
      filePath,
      hasDocumentation,
      isPublic: fileContent
        .substring(Math.max(0, startIndex - 50), startIndex)
        .includes('export'),
      lineNumber: fileContent.substring(0, startIndex).split('\n').length,
      parameters,
      returnType,
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

const extractParameters = paramString => {
  const parameters = [];

  if (!paramString || paramString.trim() === '') {
    return parameters;
  }

  const params = paramString.split(',').map(p => p.trim());

  for (const param of params) {
    if (!param) continue;

    const match = param.match(/(\w+)\s*:\s*(\w+|Promise<\w+>|\w+\[\])/);

    if (match) {
      parameters.push({
        name: match[1],
        type: match[2],
        description: 'TODO: Add description',
      });
    } else {
      const name = param.split(':')[0].trim().split('=')[0].trim();
      if (name) {
        parameters.push({
          name,
          type: 'any',
          description: 'TODO: Add description',
        });
      }
    }
  }

  return parameters;
};

const extractReturnType = (fileContent, startIndex) => {
  const functionBody = fileContent.substring(startIndex, startIndex + 500);

  const returnTypeMatch = functionBody.match(
    /\):\s*(\w+|Promise<\w+>|\w+\[\]|{\s*\w+)/,
  );

  if (returnTypeMatch) {
    return returnTypeMatch[1];
  }

  const jsdocMatch = functionBody.match(
    /@returns\s*{\s*(\w+|Promise<\w+>)\s*}/,
  );
  if (jsdocMatch) {
    return jsdocMatch[1];
  }

  return null;
};

const hasDocumentationBefore = (content, index, jsdocComments) => {
  const beforeText = content.substring(Math.max(0, index - 500), index);
  return /\/\*\*[\s\S]*?\*\//.test(beforeText) || /\/\/\s*/.test(beforeText);
};

const saveDocumentationToFiles = async (documents, projectPath, config) => {
  try {
    const docsDir = path.join(projectPath, '../../documentation');

    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    for (const doc of documents) {
      const fileName = `${doc.element.name}.md`;
      const filePath = path.join(docsDir, fileName);

      const content = `# ${doc.element.name}

**Type:** ${doc.element.elementType}
**File:** ${doc.element.filePath}
**Status:** Needs Documentation

## Generated Documentation

\`\`\`javascript
${doc.documentation}
\`\`\`

---
Generated on: ${new Date().toISOString()}
`;

      fs.writeFileSync(filePath, content, 'utf-8');
    }

    return docsDir;
  } catch (error) {
    console.error('Error saving documentation files:', error.message);
    throw error;
  }
};

export const GenerateProjectDocumentations = {
  generateProjectDocumentation,
};
