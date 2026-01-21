// ============================================================================
// DOMAIN LAYER - Core Types and Constants
// ============================================================================

// Domainlayer/types.js
 const DocumentationType = {
  API: 'api',
  README: 'readme',
  INLINE: 'inline',
  ARCHITECTURE: 'architecture',
  CHANGELOG: 'changelog',
  TUTORIAL: 'tutorial',
};

 const Severity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

 const DocumentationStatus = {
  MISSING: 'missing',
  OUTDATED: 'outdated',
  INCOMPLETE: 'incomplete',
  COMPLIANT: 'compliant',
};

 const ElementType = {
  FUNCTION: 'function',
  CLASS: 'class',
  METHOD: 'method',
  MODULE: 'module',
  INTERFACE: 'interface',
};

const DomainTypes = {
  DocumentationType,
  Severity,
  DocumentationStatus,
  ElementType,
};

export const TypeOfDomain={
  DocumentationType,
  Severity,
  DocumentationStatus,
  ElementType,
  DomainTypes
}