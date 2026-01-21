// InfrastructureLayer/typescriptParser.js
import * as fs from 'fs/promises';
import * as ts from 'typescript';

const parseTypeScriptFile = async filePath => {
  const content = await fs.readFile(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  const elements = [];

  const visit = node => {
    if (ts.isFunctionDeclaration(node)) {
      elements.push(extractTSFunctionInfo(node, filePath));
    } else if (ts.isClassDeclaration(node)) {
      elements.push(extractTSClassInfo(node, filePath));
    } else if (ts.isInterfaceDeclaration(node)) {
      elements.push(extractTSInterfaceInfo(node, filePath));
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return elements;
};

const extractTSFunctionInfo = (node, filePath) => {
  return {
    name: node.name?.getText() || 'anonymous',
    elementType: 'function',
    filePath,
    lineNumber: node.getStart(),
    hasDocumentation: hasJSDocComment(node),
    documentation: getJSDocComment(node),
    parameters: node.parameters.map(p => ({
      name: p.name.getText(),
      type: p.type?.getText() || 'any',
    })),
    returnType: node.type?.getText() || null,
    complexity: 1,
    isPublic: hasExportModifier(node),
  };
};

const extractTSClassInfo = (node, filePath) => {
  return {
    name: node.name?.getText() || 'anonymous',
    elementType: 'class',
    filePath,
    lineNumber: node.getStart(),
    hasDocumentation: hasJSDocComment(node),
    documentation: getJSDocComment(node),
    parameters: [],
    returnType: null,
    complexity: 1,
    isPublic: hasExportModifier(node),
  };
};

const extractTSInterfaceInfo = (node, filePath) => {
  return {
    name: node.name?.getText() || 'anonymous',
    elementType: 'interface',
    filePath,
    lineNumber: node.getStart(),
    hasDocumentation: hasJSDocComment(node),
    documentation: getJSDocComment(node),
    parameters: [],
    returnType: null,
    complexity: 1,
    isPublic: hasExportModifier(node),
  };
};

const hasJSDocComment = node => {
  const jsDoc = ts.getJSDocCommentsAndTags(node);
  return jsDoc.length > 0;
};

const getJSDocComment = node => {
  const jsDoc = ts.getJSDocCommentsAndTags(node);
  return jsDoc.length > 0 ? jsDoc[0].getText() : null;
};

const hasExportModifier = node => {
  return (
    node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) || false
  );
};

const TypeScriptParser = {
  parseTypeScriptFile,
};
