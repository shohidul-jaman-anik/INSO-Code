// modules/debugAgent/DomainLayer/issueDetector.js
class IssueDetector {
  /**
   * Detect potential issues in the application
   */
  async detect(applicationDetails, issueDescription = null) {
    const issues = [];

    // Detect different types of issues
    issues.push(...this._detectCodeSmells(applicationDetails));
    issues.push(...this._detectPerformanceIssues(applicationDetails));
    issues.push(...this._detectSecurityIssues(applicationDetails));
    issues.push(...this._detectArchitecturalIssues(applicationDetails));
    issues.push(...this._detectDependencyIssues(applicationDetails));

    // If specific issue description is provided, add it
    if (issueDescription) {
      issues.push({
        type: 'user_reported',
        category: 'custom',
        description: issueDescription,
        severity: this._inferSeverity(issueDescription),
        detectedAt: new Date().toISOString(),
      });
    }

    return this._prioritizeIssues(issues);
  }

  /**
   * Detect code smells
   */
  _detectCodeSmells(applicationDetails) {
    const issues = [];
    const codebase =
      applicationDetails.codebase || applicationDetails.code || {};
    const codeStr = JSON.stringify(codebase).toLowerCase();

    // Large files
    if (codeStr.length > 10000) {
      issues.push({
        type: 'code_smell',
        category: 'large_file',
        description:
          'Application contains large files that may need refactoring',
        severity: 'medium',
        location: 'codebase',
      });
    }

    // God objects (too many responsibilities)
    const classPattern = /class\s+\w+/gi;
    const methodPattern = /function\s+\w+|=>\s*{/gi;
    const classMatches = codeStr.match(classPattern) || [];
    const methodMatches = codeStr.match(methodPattern) || [];

    if (methodMatches.length > 50) {
      issues.push({
        type: 'code_smell',
        category: 'god_object',
        description:
          'High number of methods detected, possible god object anti-pattern',
        severity: 'medium',
        location: 'codebase',
      });
    }

    // Hardcoded values
    const hardcodedPatterns = [
      /password\s*=\s*['"][^'"]+['"]/i,
      /api_?key\s*=\s*['"][^'"]+['"]/i,
      /secret\s*=\s*['"][^'"]+['"]/i,
    ];

    hardcodedPatterns.forEach(pattern => {
      if (pattern.test(codeStr)) {
        issues.push({
          type: 'code_smell',
          category: 'hardcoded_credentials',
          description: 'Hardcoded credentials or secrets detected',
          severity: 'high',
          location: 'codebase',
        });
      }
    });

    return issues;
  }

  /**
   * Detect performance issues
   */
  _detectPerformanceIssues(applicationDetails) {
    const issues = [];
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();

    // N+1 query pattern
    if (
      codeStr.includes('for') &&
      (codeStr.includes('query') || codeStr.includes('find'))
    ) {
      issues.push({
        type: 'performance',
        category: 'n_plus_one',
        description: 'Potential N+1 query pattern detected',
        severity: 'high',
        location: 'database_queries',
      });
    }

    // Lack of caching
    if (
      !codeStr.includes('cache') &&
      !codeStr.includes('redis') &&
      !codeStr.includes('memcache')
    ) {
      issues.push({
        type: 'performance',
        category: 'no_caching',
        description: 'No caching mechanism detected',
        severity: 'medium',
        location: 'infrastructure',
      });
    }

    // Synchronous operations
    if (codeStr.includes('sync') && !codeStr.includes('async')) {
      issues.push({
        type: 'performance',
        category: 'synchronous_operations',
        description:
          'Synchronous operations detected that could block execution',
        severity: 'medium',
        location: 'codebase',
      });
    }

    // Large bundle size indicators
    const dependencies = applicationDetails.dependencies || {};
    const depCount = Array.isArray(dependencies)
      ? dependencies.length
      : Object.keys(dependencies).length;

    if (depCount > 100) {
      issues.push({
        type: 'performance',
        category: 'large_bundle',
        description:
          'High number of dependencies may lead to large bundle size',
        severity: 'medium',
        location: 'dependencies',
      });
    }

    return issues;
  }

  /**
   * Detect security issues
   */
  _detectSecurityIssues(applicationDetails) {
    const issues = [];
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();

    // SQL injection vulnerability
    if (codeStr.includes('query') && codeStr.includes('+')) {
      issues.push({
        type: 'security',
        category: 'sql_injection',
        description:
          'Potential SQL injection vulnerability from string concatenation',
        severity: 'critical',
        location: 'database_queries',
      });
    }

    // XSS vulnerability
    if (
      codeStr.includes('innerhtml') ||
      codeStr.includes('dangerouslysetinnerhtml')
    ) {
      issues.push({
        type: 'security',
        category: 'xss',
        description: 'Potential XSS vulnerability from innerHTML usage',
        severity: 'high',
        location: 'frontend',
      });
    }

    // Missing authentication
    if (
      !codeStr.includes('auth') &&
      !codeStr.includes('jwt') &&
      !codeStr.includes('passport')
    ) {
      issues.push({
        type: 'security',
        category: 'no_authentication',
        description: 'No authentication mechanism detected',
        severity: 'high',
        location: 'application',
      });
    }

    // Missing input validation
    if (!codeStr.includes('validate') && !codeStr.includes('sanitize')) {
      issues.push({
        type: 'security',
        category: 'no_validation',
        description: 'No input validation detected',
        severity: 'high',
        location: 'application',
      });
    }

    // Exposed sensitive information
    if (codeStr.includes('console.log') || codeStr.includes('console.error')) {
      issues.push({
        type: 'security',
        category: 'information_disclosure',
        description:
          'Console logging detected that may expose sensitive information',
        severity: 'medium',
        location: 'codebase',
      });
    }

    return issues;
  }

  /**
   * Detect architectural issues
   */
  _detectArchitecturalIssues(applicationDetails) {
    const issues = [];
    const structure = applicationDetails.structure || {};
    const structureStr = JSON.stringify(structure).toLowerCase();

    // Tight coupling
    if (
      !structureStr.includes('interface') &&
      !structureStr.includes('contract')
    ) {
      issues.push({
        type: 'architecture',
        category: 'tight_coupling',
        description:
          'Potential tight coupling - no interfaces or contracts detected',
        severity: 'medium',
        location: 'architecture',
      });
    }

    // Monolithic structure
    if (!structureStr.includes('module') && !structureStr.includes('service')) {
      issues.push({
        type: 'architecture',
        category: 'monolithic',
        description: 'Monolithic structure detected - consider modularization',
        severity: 'low',
        location: 'architecture',
      });
    }

    // Missing separation of concerns
    const hasLayers = ['controller', 'service', 'repository', 'model'].filter(
      layer => structureStr.includes(layer),
    ).length;

    if (hasLayers < 2) {
      issues.push({
        type: 'architecture',
        category: 'no_separation_of_concerns',
        description: 'Lack of clear separation of concerns in architecture',
        severity: 'medium',
        location: 'architecture',
      });
    }

    return issues;
  }

  /**
   * Detect dependency issues
   */
  _detectDependencyIssues(applicationDetails) {
    const issues = [];
    const dependencies = applicationDetails.dependencies || {};

    const depArray = Array.isArray(dependencies)
      ? dependencies
      : Object.keys(dependencies);

    // Too many dependencies
    if (depArray.length > 50) {
      issues.push({
        type: 'dependency',
        category: 'too_many_dependencies',
        description: `High number of dependencies (${depArray.length})`,
        severity: 'medium',
        location: 'dependencies',
      });
    }

    // Outdated dependencies (if version info available)
    if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
      Object.entries(dependencies).forEach(([name, version]) => {
        if (typeof version === 'string' && version.startsWith('0.')) {
          issues.push({
            type: 'dependency',
            category: 'pre_release_dependency',
            description: `Pre-release dependency detected: ${name}@${version}`,
            severity: 'low',
            location: 'dependencies',
          });
        }
      });
    }

    return issues;
  }

  /**
   * Infer severity from issue description
   */
  _inferSeverity(description) {
    const descLower = description.toLowerCase();

    const criticalKeywords = [
      'crash',
      'down',
      'critical',
      'security',
      'data loss',
    ];
    const highKeywords = ['error', 'fail', 'broken', 'not working', 'bug'];
    const mediumKeywords = ['slow', 'performance', 'issue', 'problem'];

    if (criticalKeywords.some(keyword => descLower.includes(keyword))) {
      return 'critical';
    }
    if (highKeywords.some(keyword => descLower.includes(keyword))) {
      return 'high';
    }
    if (mediumKeywords.some(keyword => descLower.includes(keyword))) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Prioritize issues by severity
   */
  _prioritizeIssues(issues) {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

    return issues.sort((a, b) => {
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Filter issues by type
   */
  filterByType(issues, type) {
    return issues.filter(issue => issue.type === type);
  }

  /**
   * Filter issues by severity
   */
  filterBySeverity(issues, severity) {
    return issues.filter(issue => issue.severity === severity);
  }

  /**
   * Get issue summary
   */
  getSummary(issues) {
    const summary = {
      total: issues.length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      byType: {},
    };

    issues.forEach(issue => {
      summary.bySeverity[issue.severity]++;
      summary.byType[issue.type] = (summary.byType[issue.type] || 0) + 1;
    });

    return summary;
  }
}

export const issueDetector = new IssueDetector();
