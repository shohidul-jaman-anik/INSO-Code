// Domainlayer/documentationRules.js
const calculateCoverage = (totalFiles, documentedFiles) => {
  if (totalFiles === 0) return 0.0;
  return (documentedFiles / totalFiles) * 100;
};

const calculateQualityScore = metrics => {
  const { coveragePercentage, issues } = metrics;
  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const highIssues = issues.filter(i => i.severity === 'high').length;

  let score = coveragePercentage;
  score -= criticalIssues * 10;
  score -= highIssues * 5;

  return Math.max(0, Math.min(100, score));
};

const shouldDocumentElement = (element, config) => {
  if (!element.isPublic) return false;
  if (element.complexity < config.minComplexity) return false;
  return true;
};

const prioritizeIssues = issues => {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...issues].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  );
};

const validateDocumentation = documentation => {
  if (!documentation || documentation.trim().length === 0) {
    return { valid: false, reason: 'Documentation is empty' };
  }
  if (documentation.length < 10) {
    return { valid: false, reason: 'Documentation too short' };
  }
  return { valid: true };
};

export const DocumentaitionRules = {
  calculateCoverage,
  calculateQualityScore,
  shouldDocumentElement,
  prioritizeIssues,
  validateDocumentation,
};
