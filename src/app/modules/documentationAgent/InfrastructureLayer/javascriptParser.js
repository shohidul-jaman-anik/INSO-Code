// ============================================================================
// INFRASTRUCTURE LAYER - Parsers and Analyzers
// ============================================================================

// InfrastructureLayer/javascriptParser.js
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as fs from 'fs/promises';

const parseJavaScriptFile = async filePath => {
  const content = await fs.readFile(filePath, 'utf-8');
  const ast = parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const elements = [];

  traverse(ast, {
    FunctionDeclaration(path) {
      elements.push(extractFunctionInfo(path, filePath));
    },
    ClassDeclaration(path) {
      elements.push(extractClassInfo(path, filePath));
    },
    ExportNamedDeclaration(path) {
      // Handle exports
    },
  });

  return elements;
};

const extractFunctionInfo = (path, filePath) => {
  const node = path.node;
  return {
    name: node.id?.name || 'anonymous',
    elementType: 'function',
    filePath,
    lineNumber: node.loc.start.line,
    hasDocumentation: !!node.leadingComments,
    documentation: node.leadingComments?.[0]?.value || null,
    parameters: node.params.map(p => ({
      name: p.name,
      type: p.typeAnnotation?.typeAnnotation?.type || 'any',
    })),
    returnType: node.returnType?.typeAnnotation?.type || null,
    complexity: calculateComplexity(path),
    isPublic: isPublicExport(path),
  };
};

const extractClassInfo = (path, filePath) => {
  const node = path.node;
  return {
    name: node.id?.name || 'anonymous',
    elementType: 'class',
    filePath,
    lineNumber: node.loc.start.line,
    hasDocumentation: !!node.leadingComments,
    documentation: node.leadingComments?.[0]?.value || null,
    parameters: [],
    returnType: null,
    complexity: 1,
    isPublic: isPublicExport(path),
  };
};

const calculateComplexity = path => {
  let complexity = 1;
  path.traverse({
    IfStatement() {
      complexity++;
    },
    ForStatement() {
      complexity++;
    },
    WhileStatement() {
      complexity++;
    },
    ConditionalExpression() {
      complexity++;
    },
  });
  return complexity;
};

const isPublicExport = path => {
  let current = path;
  while (current) {
    if (current.isExportDeclaration()) return true;
    current = current.parentPath;
  }
  return false;
};

export const JavaScriptParser = {
  parseJavaScriptFile,
};
