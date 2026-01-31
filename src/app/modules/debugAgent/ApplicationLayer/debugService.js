// modules/debugAgent/ApplicationLayer/debugService.js
import { ApiError } from '../../../utils/ApiError.js';
import { architectureAnalyzer } from '../DomainLayer/architectureAnalyzer.js';
import { claudeAIService } from '../DomainLayer/claudeAIService.js';
import { issueDetector } from '../DomainLayer/issueDetector.js';
import { performanceProfiler } from '../DomainLayer/performanceProfiler.js';
import { securityScanner } from '../DomainLayer/securityScanner.js';

class DebugService {
  /**
   * Analyze application and provide comprehensive insights
   */
  async analyzeApplication(applicationDetails, analysisDepth) {
    try {
      const prompt = this._buildApplicationAnalysisPrompt(
        applicationDetails,
        analysisDepth,
      );

      const analysis = await claudeAIService.sendMessage(prompt);

      return {
        applicationOverview: analysis.overview,
        technologyStack: analysis.techStack,
        potentialIssues: analysis.issues,
        recommendations: analysis.recommendations,
        analysisDepth,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ApiError(
        500,
        `Failed to analyze application: ${error.message}`,
      );
    }
  }

  /**
   * Generate architecture documentation and diagrams
   */
  async generateArchitecture(applicationDetails, diagramType) {
    try {
      const architectureAnalysis =
        await architectureAnalyzer.analyze(applicationDetails);

      const prompt = this._buildArchitecturePrompt(
        applicationDetails,
        architectureAnalysis,
        diagramType,
      );

      const architecture = await claudeAIService.sendMessage(prompt);

      return {
        architecture: architecture.structure,
        components: architecture.components,
        dataFlow: architecture.dataFlow,
        integrations: architecture.integrations,
        designPatterns: architecture.patterns,
        mermaidDiagram: architecture.mermaidDiagram,
        diagramType,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ApiError(
        500,
        `Failed to generate architecture: ${error.message}`,
      );
    }
  }

  /**
   * Diagnose specific issues in the application
   */
  async diagnoseIssue(applicationDetails, issueDescription, context) {
    try {
      const detectedIssues = await issueDetector.detect(
        applicationDetails,
        issueDescription,
      );

      const prompt = this._buildDiagnosisPrompt(
        applicationDetails,
        issueDescription,
        context,
        detectedIssues,
      );

      const diagnosis = await claudeAIService.sendMessage(prompt);

      return {
        rootCause: diagnosis.rootCause,
        affectedComponents: diagnosis.affectedComponents,
        severity: diagnosis.severity,
        impactAnalysis: diagnosis.impact,
        reproducibleSteps: diagnosis.steps,
        relatedIssues: diagnosis.relatedIssues,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ApiError(500, `Failed to diagnose issue: ${error.message}`);
    }
  }

  /**
   * Trace execution flow through the application
   */
  async traceExecution(applicationDetails, executionPath, parameters) {
    try {
      const prompt = this._buildExecutionTracePrompt(
        applicationDetails,
        executionPath,
        parameters,
      );

      const trace = await claudeAIService.sendMessage(prompt);

      return {
        executionFlow: trace.flow,
        callStack: trace.callStack,
        dataTransformations: trace.dataTransformations,
        potentialBottlenecks: trace.bottlenecks,
        edgeCases: trace.edgeCases,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ApiError(500, `Failed to trace execution: ${error.message}`);
    }
  }

  /**
   * Suggest fixes for identified issues
   */
  async suggestFixes(applicationDetails, issues, priority) {
    try {
      const prompt = this._buildFixSuggestionPrompt(
        applicationDetails,
        issues,
        priority,
      );

      const fixes = await claudeAIService.sendMessage(prompt);

      return {
        fixes: fixes.solutions,
        implementation: fixes.implementationSteps,
        codeExamples: fixes.codeExamples,
        testingStrategy: fixes.testingStrategy,
        rollbackPlan: fixes.rollbackPlan,
        estimatedEffort: fixes.estimatedEffort,
        priority,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ApiError(500, `Failed to suggest fixes: ${error.message}`);
    }
  }

  /**
   * Analyze performance bottlenecks
   */
  async analyzePerformance(applicationDetails, performanceMetrics) {
    try {
      const profileData = await performanceProfiler.profile(
        applicationDetails,
        performanceMetrics,
      );

      const prompt = this._buildPerformanceAnalysisPrompt(
        applicationDetails,
        profileData,
      );

      const performanceAnalysis = await claudeAIService.sendMessage(prompt);

      return {
        bottlenecks: performanceAnalysis.bottlenecks,
        optimizations: performanceAnalysis.optimizations,
        benchmarks: performanceAnalysis.benchmarks,
        scalabilityAnalysis: performanceAnalysis.scalability,
        resourceUtilization: performanceAnalysis.resourceUtilization,
        recommendations: performanceAnalysis.recommendations,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ApiError(
        500,
        `Failed to analyze performance: ${error.message}`,
      );
    }
  }

  /**
   * Conduct comprehensive security audit
   */
  async conductSecurityAudit(applicationDetails, auditScope) {
    try {
      const scanResults = await securityScanner.scan(
        applicationDetails,
        auditScope,
      );

      const prompt = this._buildSecurityAuditPrompt(
        applicationDetails,
        scanResults,
        auditScope,
      );

      const securityAudit = await claudeAIService.sendMessage(prompt);

      return {
        vulnerabilities: securityAudit.vulnerabilities,
        riskAssessment: securityAudit.riskAssessment,
        compliance: securityAudit.compliance,
        remediationSteps: securityAudit.remediationSteps,
        bestPractices: securityAudit.bestPractices,
        auditScope,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ApiError(
        500,
        `Failed to conduct security audit: ${error.message}`,
      );
    }
  }

  // Private helper methods for building prompts
  _buildApplicationAnalysisPrompt(applicationDetails, analysisDepth) {
    return `You are a Senior Software Architect and Debug Expert. Analyze the following application details and provide comprehensive insights.

Application Details:
${JSON.stringify(applicationDetails, null, 2)}

Analysis Depth: ${analysisDepth}

Please provide:
1. Application Overview - High-level summary of what the application does
2. Technology Stack - Identified technologies, frameworks, and tools
3. Potential Issues - Any architectural concerns, anti-patterns, or code smells
4. Recommendations - Actionable improvements for better design and performance

Return your response in the following JSON structure:
{
  "overview": "string",
  "techStack": ["string"],
  "issues": [{"type": "string", "description": "string", "severity": "string"}],
  "recommendations": [{"category": "string", "suggestion": "string", "impact": "string"}]
}`;
  }

  _buildArchitecturePrompt(
    applicationDetails,
    architectureAnalysis,
    diagramType,
  ) {
    return `You are a Senior Software Architect. Generate comprehensive architecture documentation for the following application.

Application Details:
${JSON.stringify(applicationDetails, null, 2)}

Architecture Analysis:
${JSON.stringify(architectureAnalysis, null, 2)}

Diagram Type: ${diagramType}

Please provide:
1. Architecture Structure - Layers, tiers, and overall organization
2. Components - Key modules and their responsibilities
3. Data Flow - How data moves through the system
4. Integrations - External services and APIs
5. Design Patterns - Identified patterns used in the architecture
6. Mermaid Diagram - Visual representation in Mermaid syntax

Return your response in the following JSON structure:
{
  "structure": {"layers": [], "organization": "string"},
  "components": [{"name": "string", "responsibility": "string", "dependencies": []}],
  "dataFlow": [{"from": "string", "to": "string", "description": "string"}],
  "integrations": [{"service": "string", "purpose": "string", "protocol": "string"}],
  "patterns": [{"pattern": "string", "usage": "string"}],
  "mermaidDiagram": "string"
}`;
  }

  _buildDiagnosisPrompt(
    applicationDetails,
    issueDescription,
    context,
    detectedIssues,
  ) {
    return `You are a Senior Debug Engineer. Diagnose the following issue in detail.

Application Details:
${JSON.stringify(applicationDetails, null, 2)}

Issue Description:
${issueDescription}

Context:
${JSON.stringify(context, null, 2)}

Detected Issues:
${JSON.stringify(detectedIssues, null, 2)}

Please provide:
1. Root Cause - The fundamental reason for the issue
2. Affected Components - Which parts of the system are impacted
3. Severity - Critical, High, Medium, or Low
4. Impact Analysis - Business and technical impact
5. Reproducible Steps - How to consistently reproduce the issue
6. Related Issues - Similar or connected problems

Return your response in the following JSON structure:
{
  "rootCause": "string",
  "affectedComponents": ["string"],
  "severity": "string",
  "impact": {"business": "string", "technical": "string"},
  "steps": ["string"],
  "relatedIssues": ["string"]
}`;
  }

  _buildExecutionTracePrompt(applicationDetails, executionPath, parameters) {
    return `You are a Senior Debug Engineer. Trace the execution flow through the application.

Application Details:
${JSON.stringify(applicationDetails, null, 2)}

Execution Path:
${executionPath}

Parameters:
${JSON.stringify(parameters, null, 2)}

Please provide:
1. Execution Flow - Step-by-step flow through the system
2. Call Stack - The sequence of function/method calls
3. Data Transformations - How data changes at each step
4. Potential Bottlenecks - Performance concerns in the flow
5. Edge Cases - Potential failure scenarios

Return your response in the following JSON structure:
{
  "flow": [{"step": "string", "action": "string", "result": "string"}],
  "callStack": ["string"],
  "dataTransformations": [{"stage": "string", "input": "string", "output": "string"}],
  "bottlenecks": [{"location": "string", "reason": "string", "impact": "string"}],
  "edgeCases": [{"scenario": "string", "handling": "string"}]
}`;
  }

  _buildFixSuggestionPrompt(applicationDetails, issues, priority) {
    return `You are a Senior Software Engineer. Suggest comprehensive fixes for the identified issues.

Application Details:
${JSON.stringify(applicationDetails, null, 2)}

Issues:
${JSON.stringify(issues, null, 2)}

Priority: ${priority}

Please provide:
1. Solutions - Specific fixes for each issue
2. Implementation Steps - How to apply the fixes
3. Code Examples - Sample code demonstrating the fix
4. Testing Strategy - How to verify the fixes work
5. Rollback Plan - How to revert if needed
6. Estimated Effort - Time/complexity estimate

Return your response in the following JSON structure:
{
  "solutions": [{"issue": "string", "solution": "string", "rationale": "string"}],
  "implementationSteps": [{"step": "string", "description": "string"}],
  "codeExamples": [{"context": "string", "before": "string", "after": "string"}],
  "testingStrategy": {"approach": "string", "testCases": []},
  "rollbackPlan": "string",
  "estimatedEffort": {"hours": "number", "complexity": "string"}
}`;
  }

  _buildPerformanceAnalysisPrompt(applicationDetails, profileData) {
    return `You are a Senior Performance Engineer. Analyze performance bottlenecks and suggest optimizations.

Application Details:
${JSON.stringify(applicationDetails, null, 2)}

Profile Data:
${JSON.stringify(profileData, null, 2)}

Please provide:
1. Bottlenecks - Identified performance bottlenecks
2. Optimizations - Specific optimization recommendations
3. Benchmarks - Expected performance improvements
4. Scalability Analysis - How well the application will scale
5. Resource Utilization - CPU, memory, network, I/O analysis
6. Recommendations - Priority-ordered action items

Return your response in the following JSON structure:
{
  "bottlenecks": [{"location": "string", "type": "string", "impact": "string"}],
  "optimizations": [{"area": "string", "technique": "string", "expectedGain": "string"}],
  "benchmarks": {"current": {}, "projected": {}},
  "scalability": {"horizontal": "string", "vertical": "string", "limitations": []},
  "resourceUtilization": {"cpu": "string", "memory": "string", "network": "string", "io": "string"},
  "recommendations": [{"priority": "string", "action": "string", "impact": "string"}]
}`;
  }

  _buildSecurityAuditPrompt(applicationDetails, scanResults, auditScope) {
    return `You are a Senior Security Engineer. Conduct a comprehensive security audit.

Application Details:
${JSON.stringify(applicationDetails, null, 2)}

Scan Results:
${JSON.stringify(scanResults, null, 2)}

Audit Scope: ${auditScope}

Please provide:
1. Vulnerabilities - Identified security vulnerabilities
2. Risk Assessment - Overall security risk level
3. Compliance - Compliance with security standards (OWASP, etc.)
4. Remediation Steps - How to fix each vulnerability
5. Best Practices - Security best practices to implement

Return your response in the following JSON structure:
{
  "vulnerabilities": [{"type": "string", "severity": "string", "description": "string", "location": "string"}],
  "riskAssessment": {"overallRisk": "string", "criticalFindings": "number", "highFindings": "number"},
  "compliance": [{"standard": "string", "status": "string", "gaps": []}],
  "remediationSteps": [{"vulnerability": "string", "steps": [], "priority": "string"}],
  "bestPractices": [{"category": "string", "practice": "string", "implementation": "string"}]
}`;
  }
}

export const debugService = new DebugService();
