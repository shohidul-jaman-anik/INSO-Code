// ============================================================================
// DOMAIN LAYER - Entity Factories
// ============================================================================

// Domainlayer/documentationFactory.js
import { v4 as uuidv4 } from 'uuid';

const createDocumentationIssue = ({
  filePath,
  issueType,
  severity,
  message,
  lineNumber = null,
  suggestedFix = null,
}) => ({
  id: uuidv4(),
  filePath,
  issueType,
  severity,
  message,
  lineNumber,
  suggestedFix,
  createdAt: new Date().toISOString(),
});

const createDocumentationMetrics = ({
  totalFiles = 0,
  documentedFiles = 0,
  missingDocs = 0,
  outdatedDocs = 0,
  coveragePercentage = 0.0,
  qualityScore = 0.0,
  issues = [],
}) => ({
  totalFiles,
  documentedFiles,
  missingDocs,
  outdatedDocs,
  coveragePercentage,
  qualityScore,
  issues,
});

const createCodeElement = ({
  name,
  elementType,
  filePath,
  lineNumber,
  hasDocumentation = false,
  documentation = null,
  parameters = [],
  returnType = null,
  complexity = 0,
  isPublic = true,
}) => ({
  name,
  elementType,
  filePath,
  lineNumber,
  hasDocumentation,
  documentation,
  parameters,
  returnType,
  complexity,
  isPublic,
});

const createDocumentationConfig = ({
  minComplexity = 3,
  coverageTarget = 85.0,
  enforceJsdoc = true,
  enforceOpenapi = true,
  autoGenerate = true,
  includeExamples = true,
  outputFormats = ['markdown', 'html'],
}) => ({
  minComplexity,
  coverageTarget,
  enforceJsdoc,
  enforceOpenapi,
  autoGenerate,
  includeExamples,
  outputFormats,
});

export const DocumentationFactory = {
  createDocumentationIssue,
  createDocumentationMetrics,
  createCodeElement,
  createDocumentationConfig,
};
