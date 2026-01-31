// modules/debugAgent/DomainLayer/securityScanner.js
class SecurityScanner {
  /**
   * Scan application for security vulnerabilities
   */
  async scan(applicationDetails, auditScope) {
    const scanResults = {
      vulnerabilities: this._scanVulnerabilities(applicationDetails),
      compliance: this._checkCompliance(applicationDetails),
      authentication: this._analyzeAuthentication(applicationDetails),
      authorization: this._analyzeAuthorization(applicationDetails),
      dataProtection: this._analyzeDataProtection(applicationDetails),
      auditScope,
      timestamp: new Date().toISOString(),
    };

    return scanResults;
  }

  /**
   * Scan for common vulnerabilities
   */
  _scanVulnerabilities(applicationDetails) {
    const vulnerabilities = [];
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();

    // OWASP Top 10 checks
    vulnerabilities.push(...this._checkInjectionFlaws(codeStr));
    vulnerabilities.push(...this._checkBrokenAuthentication(codeStr));
    vulnerabilities.push(...this._checkSensitiveDataExposure(codeStr));
    vulnerabilities.push(...this._checkXML_XXEFlaws(codeStr));
    vulnerabilities.push(...this._checkBrokenAccessControl(codeStr));
    vulnerabilities.push(...this._checkSecurityMisconfiguration(codeStr));
    vulnerabilities.push(...this._checkXSS(codeStr));
    vulnerabilities.push(...this._checkInsecureDeserialization(codeStr));
    vulnerabilities.push(
      ...this._checkVulnerableComponents(applicationDetails),
    );
    vulnerabilities.push(...this._checkInsufficientLogging(codeStr));

    return vulnerabilities;
  }

  /**
   * Check for injection flaws (SQL, NoSQL, Command, etc.)
   */
  _checkInjectionFlaws(codeStr) {
    const vulnerabilities = [];

    // SQL Injection
    if (
      (codeStr.includes('query') || codeStr.includes('execute')) &&
      (codeStr.includes('+') ||
        codeStr.includes('${') ||
        codeStr.includes('concat'))
    ) {
      vulnerabilities.push({
        type: 'A01:2021 - Injection',
        severity: 'critical',
        category: 'sql_injection',
        description: 'Potential SQL injection vulnerability detected',
        cwe: 'CWE-89',
        recommendation: 'Use parameterized queries or prepared statements',
        owasp: 'A01:2021',
      });
    }

    // NoSQL Injection
    if (codeStr.includes('$where') || codeStr.includes('$regex')) {
      vulnerabilities.push({
        type: 'A01:2021 - Injection',
        severity: 'high',
        category: 'nosql_injection',
        description: 'Potential NoSQL injection vulnerability detected',
        cwe: 'CWE-943',
        recommendation: 'Sanitize user input and use query builders',
        owasp: 'A01:2021',
      });
    }

    // Command Injection
    if (
      codeStr.includes('exec') ||
      codeStr.includes('spawn') ||
      codeStr.includes('shell')
    ) {
      vulnerabilities.push({
        type: 'A01:2021 - Injection',
        severity: 'critical',
        category: 'command_injection',
        description: 'Potential command injection vulnerability detected',
        cwe: 'CWE-78',
        recommendation: 'Avoid executing system commands with user input',
        owasp: 'A01:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for broken authentication
   */
  _checkBrokenAuthentication(codeStr) {
    const vulnerabilities = [];

    // Missing authentication
    if (
      !codeStr.includes('auth') &&
      !codeStr.includes('jwt') &&
      !codeStr.includes('passport') &&
      !codeStr.includes('session')
    ) {
      vulnerabilities.push({
        type: 'A02:2021 - Cryptographic Failures',
        severity: 'critical',
        category: 'missing_authentication',
        description: 'No authentication mechanism detected',
        cwe: 'CWE-287',
        recommendation: 'Implement proper authentication (JWT, OAuth, etc.)',
        owasp: 'A02:2021',
      });
    }

    // Weak password storage
    if (
      codeStr.includes('password') &&
      !codeStr.includes('bcrypt') &&
      !codeStr.includes('argon') &&
      !codeStr.includes('scrypt')
    ) {
      vulnerabilities.push({
        type: 'A02:2021 - Cryptographic Failures',
        severity: 'critical',
        category: 'weak_password_storage',
        description: 'Passwords may not be properly hashed',
        cwe: 'CWE-916',
        recommendation: 'Use bcrypt, argon2, or scrypt for password hashing',
        owasp: 'A02:2021',
      });
    }

    // Session management issues
    if (
      codeStr.includes('session') &&
      !codeStr.includes('secure') &&
      !codeStr.includes('httponly')
    ) {
      vulnerabilities.push({
        type: 'A02:2021 - Cryptographic Failures',
        severity: 'high',
        category: 'insecure_session',
        description: 'Session cookies may not be properly secured',
        cwe: 'CWE-614',
        recommendation: 'Set secure and httpOnly flags on session cookies',
        owasp: 'A02:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for sensitive data exposure
   */
  _checkSensitiveDataExposure(codeStr) {
    const vulnerabilities = [];

    // Hardcoded secrets
    const secretPatterns = [
      { pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/, name: 'API Key' },
      { pattern: /secret\s*=\s*['"][^'"]+['"]/, name: 'Secret' },
      { pattern: /password\s*=\s*['"][^'"]+['"]/, name: 'Password' },
      { pattern: /token\s*=\s*['"][^'"]+['"]/, name: 'Token' },
    ];

    secretPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(codeStr)) {
        vulnerabilities.push({
          type: 'A02:2021 - Cryptographic Failures',
          severity: 'critical',
          category: 'hardcoded_secrets',
          description: `Hardcoded ${name} detected in code`,
          cwe: 'CWE-798',
          recommendation:
            'Use environment variables or secret management services',
          owasp: 'A02:2021',
        });
      }
    });

    // Missing encryption
    if (
      !codeStr.includes('encrypt') &&
      !codeStr.includes('crypto') &&
      (codeStr.includes('password') || codeStr.includes('credit'))
    ) {
      vulnerabilities.push({
        type: 'A02:2021 - Cryptographic Failures',
        severity: 'high',
        category: 'missing_encryption',
        description: 'Sensitive data may not be encrypted',
        cwe: 'CWE-311',
        recommendation: 'Encrypt sensitive data at rest and in transit',
        owasp: 'A02:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for XML/XXE flaws
   */
  _checkXML_XXEFlaws(codeStr) {
    const vulnerabilities = [];

    if (codeStr.includes('xml') && codeStr.includes('parse')) {
      vulnerabilities.push({
        type: 'A05:2021 - Security Misconfiguration',
        severity: 'high',
        category: 'xxe',
        description: 'Potential XXE (XML External Entity) vulnerability',
        cwe: 'CWE-611',
        recommendation: 'Disable XML external entity processing',
        owasp: 'A05:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for broken access control
   */
  _checkBrokenAccessControl(codeStr) {
    const vulnerabilities = [];

    // Missing authorization checks
    if (
      !codeStr.includes('authorize') &&
      !codeStr.includes('permission') &&
      !codeStr.includes('role')
    ) {
      vulnerabilities.push({
        type: 'A01:2021 - Broken Access Control',
        severity: 'critical',
        category: 'missing_authorization',
        description: 'No authorization mechanism detected',
        cwe: 'CWE-862',
        recommendation: 'Implement proper authorization and access control',
        owasp: 'A01:2021',
      });
    }

    // IDOR vulnerability indicators
    if (
      codeStr.includes('userid') ||
      (codeStr.includes('id') && !codeStr.includes('authorize'))
    ) {
      vulnerabilities.push({
        type: 'A01:2021 - Broken Access Control',
        severity: 'high',
        category: 'idor',
        description: 'Potential Insecure Direct Object Reference (IDOR)',
        cwe: 'CWE-639',
        recommendation: 'Validate user permissions before accessing resources',
        owasp: 'A01:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for security misconfiguration
   */
  _checkSecurityMisconfiguration(codeStr) {
    const vulnerabilities = [];

    // CORS misconfiguration
    if (codeStr.includes('cors') && codeStr.includes('*')) {
      vulnerabilities.push({
        type: 'A05:2021 - Security Misconfiguration',
        severity: 'medium',
        category: 'cors_misconfiguration',
        description: 'Overly permissive CORS policy detected',
        cwe: 'CWE-942',
        recommendation: 'Configure CORS to allow only trusted origins',
        owasp: 'A05:2021',
      });
    }

    // Debug mode in production
    if (codeStr.includes('debug') && codeStr.includes('true')) {
      vulnerabilities.push({
        type: 'A05:2021 - Security Misconfiguration',
        severity: 'medium',
        category: 'debug_mode',
        description: 'Debug mode may be enabled',
        cwe: 'CWE-489',
        recommendation: 'Disable debug mode in production',
        owasp: 'A05:2021',
      });
    }

    // Missing security headers
    if (
      !codeStr.includes('helmet') &&
      !codeStr.includes('content-security-policy')
    ) {
      vulnerabilities.push({
        type: 'A05:2021 - Security Misconfiguration',
        severity: 'medium',
        category: 'missing_security_headers',
        description: 'Security headers may not be configured',
        cwe: 'CWE-693',
        recommendation: 'Implement security headers (CSP, HSTS, etc.)',
        owasp: 'A05:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for XSS vulnerabilities
   */
  _checkXSS(codeStr) {
    const vulnerabilities = [];

    // DOM-based XSS
    if (
      codeStr.includes('innerhtml') ||
      codeStr.includes('dangerouslysetinnerhtml')
    ) {
      vulnerabilities.push({
        type: 'A03:2021 - Injection',
        severity: 'high',
        category: 'xss',
        description: 'Potential XSS vulnerability from innerHTML usage',
        cwe: 'CWE-79',
        recommendation: 'Use textContent or sanitize HTML input',
        owasp: 'A03:2021',
      });
    }

    // Eval usage
    if (codeStr.includes('eval(')) {
      vulnerabilities.push({
        type: 'A03:2021 - Injection',
        severity: 'critical',
        category: 'code_injection',
        description: 'Use of eval() detected - high security risk',
        cwe: 'CWE-95',
        recommendation: 'Avoid eval() and use safer alternatives',
        owasp: 'A03:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for insecure deserialization
   */
  _checkInsecureDeserialization(codeStr) {
    const vulnerabilities = [];

    if (
      codeStr.includes('deserialize') ||
      codeStr.includes('unserialize') ||
      codeStr.includes('pickle')
    ) {
      vulnerabilities.push({
        type: 'A08:2021 - Software and Data Integrity Failures',
        severity: 'high',
        category: 'insecure_deserialization',
        description: 'Potential insecure deserialization vulnerability',
        cwe: 'CWE-502',
        recommendation: 'Validate and sanitize serialized data',
        owasp: 'A08:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for vulnerable components
   */
  _checkVulnerableComponents(applicationDetails) {
    const vulnerabilities = [];
    const dependencies = applicationDetails.dependencies || {};

    // Check if npm audit or similar should be run
    if (Object.keys(dependencies).length > 0) {
      vulnerabilities.push({
        type: 'A06:2021 - Vulnerable and Outdated Components',
        severity: 'medium',
        category: 'outdated_dependencies',
        description: 'Dependencies should be audited for known vulnerabilities',
        cwe: 'CWE-1104',
        recommendation:
          'Run npm audit or similar tool to check for vulnerabilities',
        owasp: 'A06:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check for insufficient logging
   */
  _checkInsufficientLogging(codeStr) {
    const vulnerabilities = [];

    if (!codeStr.includes('log') && !codeStr.includes('logger')) {
      vulnerabilities.push({
        type: 'A09:2021 - Security Logging and Monitoring Failures',
        severity: 'low',
        category: 'insufficient_logging',
        description: 'Insufficient logging detected',
        cwe: 'CWE-778',
        recommendation: 'Implement comprehensive logging and monitoring',
        owasp: 'A09:2021',
      });
    }

    return vulnerabilities;
  }

  /**
   * Check compliance with security standards
   */
  _checkCompliance(applicationDetails) {
    const compliance = {
      owasp: this._checkOWASPCompliance(applicationDetails),
      pci: this._checkPCICompliance(applicationDetails),
      gdpr: this._checkGDPRCompliance(applicationDetails),
      hipaa: this._checkHIPAACompliance(applicationDetails),
    };

    return compliance;
  }

  /**
   * Check OWASP compliance
   */
  _checkOWASPCompliance(applicationDetails) {
    const vulnerabilities = this._scanVulnerabilities(applicationDetails);
    const criticalCount = vulnerabilities.filter(
      v => v.severity === 'critical',
    ).length;
    const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

    return {
      compliant: criticalCount === 0 && highCount === 0,
      score: Math.max(0, 100 - (criticalCount * 20 + highCount * 10)),
      issues: vulnerabilities.length,
      critical: criticalCount,
      high: highCount,
    };
  }

  /**
   * Check PCI DSS compliance (basic)
   */
  _checkPCICompliance(applicationDetails) {
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();
    const issues = [];

    if (!codeStr.includes('encrypt')) {
      issues.push('Missing encryption for sensitive data');
    }
    if (!codeStr.includes('auth')) {
      issues.push('Missing authentication mechanism');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  /**
   * Check GDPR compliance (basic)
   */
  _checkGDPRCompliance(applicationDetails) {
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();
    const issues = [];

    if (!codeStr.includes('consent')) {
      issues.push('No user consent mechanism detected');
    }
    if (!codeStr.includes('privacy')) {
      issues.push('No privacy policy implementation detected');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  /**
   * Check HIPAA compliance (basic)
   */
  _checkHIPAACompliance(applicationDetails) {
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();
    const issues = [];

    if (!codeStr.includes('encrypt')) {
      issues.push('Missing encryption for PHI');
    }
    if (!codeStr.includes('audit') && !codeStr.includes('log')) {
      issues.push('Missing audit logging');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  /**
   * Analyze authentication implementation
   */
  _analyzeAuthentication(applicationDetails) {
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();

    return {
      implemented:
        codeStr.includes('auth') ||
        codeStr.includes('jwt') ||
        codeStr.includes('passport'),
      methods: this._detectAuthMethods(codeStr),
      mfa:
        codeStr.includes('mfa') ||
        codeStr.includes('2fa') ||
        codeStr.includes('two-factor'),
      passwordPolicy:
        codeStr.includes('password') && codeStr.includes('validate'),
    };
  }

  /**
   * Detect authentication methods
   */
  _detectAuthMethods(codeStr) {
    const methods = [];

    if (codeStr.includes('jwt')) methods.push('JWT');
    if (codeStr.includes('oauth')) methods.push('OAuth');
    if (codeStr.includes('saml')) methods.push('SAML');
    if (codeStr.includes('session')) methods.push('Session-based');
    if (codeStr.includes('basic auth')) methods.push('Basic Auth');

    return methods;
  }

  /**
   * Analyze authorization implementation
   */
  _analyzeAuthorization(applicationDetails) {
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();

    return {
      implemented:
        codeStr.includes('authorize') ||
        codeStr.includes('permission') ||
        codeStr.includes('role'),
      rbac: codeStr.includes('role') && codeStr.includes('permission'),
      abac: codeStr.includes('attribute') && codeStr.includes('policy'),
    };
  }

  /**
   * Analyze data protection measures
   */
  _analyzeDataProtection(applicationDetails) {
    const codeStr = JSON.stringify(applicationDetails).toLowerCase();

    return {
      encryption: codeStr.includes('encrypt') || codeStr.includes('crypto'),
      https:
        codeStr.includes('https') ||
        codeStr.includes('ssl') ||
        codeStr.includes('tls'),
      dataValidation:
        codeStr.includes('validate') || codeStr.includes('sanitize'),
      backups: codeStr.includes('backup'),
    };
  }
}

export const securityScanner = new SecurityScanner();
