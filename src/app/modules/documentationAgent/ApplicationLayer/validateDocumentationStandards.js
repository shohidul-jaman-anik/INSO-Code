// ApplicationLayer/validateDocumentationStandards.js
import fs from 'fs';
import path from 'path';

const validateDocumentationStandard = async (projectPath, config) => {
  const violations = [];
  const codeElements = await parseProject(projectPath);

  for (const element of codeElements) {
    if (config.enforceJsdoc && element.isPublic && !hasValidJSDoc(element)) {
      violations.push({
        file: element.filePath,
        line: element.lineNumber,
        rule: 'JSDoc required for public exports',
        element: element.name,
      });
    }
  }

  return {
    success: true,
    data: {
      compliant: violations.length === 0,
      violations,
    },
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

const hasValidJSDoc = element => {
  if (!element.documentation) return false;
  return (
    element.documentation.includes('@param') ||
    element.documentation.includes('@returns')
  );
};

export const ValidateDocumentationStandard = {
  validateDocumentationStandards: validateDocumentationStandard,
};
