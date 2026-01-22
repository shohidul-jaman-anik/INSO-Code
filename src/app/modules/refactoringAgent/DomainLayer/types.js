// ============================================================================
// DOMAIN LAYER - Core Types and Constants
// ============================================================================

// modules/refactoringAgent/DomainLayer/types.js
const RefactoringType = {
  EXTRACT_FUNCTION: 'extract_function',
  EXTRACT_METHOD: 'extract_method',
  RENAME: 'rename',
  MOVE_FILE: 'move_file',
  INLINE: 'inline',
  REMOVE_DEAD_CODE: 'remove_dead_code',
  SIMPLIFY_CONDITIONAL: 'simplify_conditional',
  REMOVE_DUPLICATION: 'remove_duplication',
  OPTIMIZE_IMPORTS: 'optimize_imports',
  MODERNIZE_SYNTAX: 'modernize_syntax',
};

const CodeSmellType = {
  LONG_METHOD: 'long_method',
  LONG_PARAMETER_LIST: 'long_parameter_list',
  DUPLICATED_CODE: 'duplicated_code',
  LARGE_CLASS: 'large_class',
  COMPLEX_CONDITIONAL: 'complex_conditional',
  DEAD_CODE: 'dead_code',
  MAGIC_NUMBER: 'magic_number',
  NESTED_CALLBACKS: 'nested_callbacks',
  GOD_OBJECT: 'god_object',
  FEATURE_ENVY: 'feature_envy',
};

const Severity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const RefactoringStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
};

export { CodeSmellType, RefactoringStatus, RefactoringType, Severity };
