// ============================================
// modules/reviewQAAgent/DomainLayer/prompts/reviewQAPrompts.js
// ============================================
export const createCodeReviewPrompt = (code, language, focusAreas) => {
  return `You are a Senior Code Review Expert with 15+ years of experience in software quality assurance.

Perform a comprehensive code review on the following ${language} code.

FOCUS AREAS: ${focusAreas.join(', ')}

CODE:
\`\`\`${language}
${code}
\`\`\`

Provide a detailed code review in JSON format:
{
  "overallQuality": "Excellent/Good/Fair/Poor",
  "qualityScore": "Score out of 100",
  "summary": "Executive summary of the code review",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "issues": [
    {
      "severity": "Critical/High/Medium/Low",
      "category": "Bug/Security/Performance/Style/Design",
      "line": "Line number or range",
      "issue": "Description of the issue",
      "recommendation": "How to fix it",
      "example": "Example of fixed code"
    }
  ],
  "codeQualityMetrics": {
    "readability": "Score out of 10",
    "maintainability": "Score out of 10",
    "efficiency": "Score out of 10",
    "testability": "Score out of 10",
    "documentation": "Score out of 10"
  },
  "complexity": {
    "cyclomaticComplexity": "Complexity score",
    "cognitiveComplexity": "Cognitive load assessment",
    "analysis": "Complexity analysis"
  },
  "recommendations": [
    {
      "priority": "High/Medium/Low",
      "recommendation": "Recommendation description",
      "impact": "Expected impact"
    }
  ],
  "positivePatterns": [
    "Good pattern observed 1",
    "Good pattern observed 2"
  ],
  "refactoringOpportunities": [
    {
      "type": "Extract method/Simplify condition/etc",
      "location": "Where in code",
      "benefit": "Why refactor"
    }
  ]
}

Respond ONLY with valid JSON.`;
};

export const createPerformanceAnalysisPrompt = (code, language, expectedLoad) => {
  return `You are a Performance Engineering Expert specializing in code optimization.

Analyze the performance characteristics of the following ${language} code.

EXPECTED LOAD: ${expectedLoad || 'Medium'}

CODE:
\`\`\`${language}
${code}
\`\`\`

Provide a detailed performance analysis in JSON format:
{
  "performanceRating": "Excellent/Good/Fair/Poor",
  "overallScore": "Score out of 100",
  "summary": "Performance analysis summary",
  "timeComplexity": {
    "bigO": "Big O notation",
    "analysis": "Detailed complexity analysis",
    "worstCase": "Worst case scenario"
  },
  "spaceComplexity": {
    "bigO": "Big O notation",
    "memoryUsage": "Memory usage analysis"
  },
  "bottlenecks": [
    {
      "severity": "Critical/High/Medium/Low",
      "location": "Line or section",
      "issue": "Performance bottleneck",
      "impact": "Performance impact",
      "solution": "Optimization solution",
      "expectedGain": "Expected performance gain"
    }
  ],
  "optimizations": [
    {
      "type": "Algorithm/Data Structure/Caching/etc",
      "current": "Current implementation",
      "recommended": "Recommended approach",
      "benefit": "Expected benefit",
      "tradeoff": "Any tradeoffs"
    }
  ],
  "resourceUsage": {
    "cpu": "CPU usage analysis",
    "memory": "Memory usage analysis",
    "io": "I/O operations analysis",
    "network": "Network calls analysis"
  },
  "scalability": {
    "rating": "Excellent/Good/Fair/Poor",
    "currentCapacity": "Estimated current capacity",
    "scalabilityIssues": ["Issue 1"],
    "recommendations": ["Recommendation 1"]
  },
  "inefficientPatterns": [
    {
      "pattern": "Pattern name (N+1 query, etc)",
      "location": "Where found",
      "fix": "How to fix"
    }
  ],
  "benchmarkEstimates": {
    "smallDataset": "Estimated performance",
    "mediumDataset": "Estimated performance",
    "largeDataset": "Estimated performance"
  }
}

Respond ONLY with valid JSON.`;
};

export const createBestPracticesPrompt = (code, language, standards) => {
  return `You are a Software Engineering Standards Expert.

Review the following ${language} code against industry best practices and coding standards.

${standards ? `STANDARDS: ${standards}` : 'Use industry-standard best practices'}

CODE:
\`\`\`${language}
${code}
\`\`\`

Provide a best practices review in JSON format:
{
  "complianceScore": "Score out of 100",
  "overallAssessment": "Excellent/Good/Needs Improvement/Poor",
  "summary": "Summary of adherence to best practices",
  "categories": {
    "namingConventions": {
      "score": "Score out of 10",
      "compliant": true/false,
      "issues": ["Issue 1"],
      "examples": ["Example of issue"]
    },
    "codeOrganization": {
      "score": "Score out of 10",
      "compliant": true/false,
      "issues": ["Issue 1"]
    },
    "errorHandling": {
      "score": "Score out of 10",
      "compliant": true/false,
      "issues": ["Issue 1"]
    },
    "documentation": {
      "score": "Score out of 10",
      "compliant": true/false,
      "issues": ["Issue 1"]
    },
    "solidPrinciples": {
      "singleResponsibility": "Pass/Fail/Partial",
      "openClosed": "Pass/Fail/Partial",
      "liskovSubstitution": "Pass/Fail/Partial",
      "interfaceSegregation": "Pass/Fail/Partial",
      "dependencyInversion": "Pass/Fail/Partial"
    },
    "dryPrinciple": {
      "score": "Score out of 10",
      "duplicateCode": ["Location of duplicate code"]
    },
    "separationOfConcerns": {
      "score": "Score out of 10",
      "issues": ["Issue 1"]
    }
  },
  "violations": [
    {
      "severity": "High/Medium/Low",
      "principle": "Violated principle or standard",
      "location": "Where in code",
      "explanation": "Why this is a violation",
      "fix": "How to fix"
    }
  ],
  "languageSpecificBestPractices": [
    {
      "practice": "Best practice specific to the language",
      "followed": true/false,
      "recommendation": "Recommendation if not followed"
    }
  ],
  "designPatternOpportunities": [
    {
      "pattern": "Design pattern name",
      "applicability": "Where it could be applied",
      "benefit": "Benefit of applying it"
    }
  ],
  "recommendations": [
    {
      "priority": "High/Medium/Low",
      "category": "Category",
      "recommendation": "Specific recommendation",
      "impact": "Expected impact"
    }
  ]
}

Respond ONLY with valid JSON.`;
};

export const createFullQAReportPrompt = (code, language, projectContext, testCode) => {
  return `You are a Senior QA Engineer and Quality Assurance Lead.

Generate a comprehensive QA report covering all aspects of code quality.

PROJECT CONTEXT: ${projectContext || 'General application'}
${testCode ? 'TEST CODE PROVIDED: Yes' : 'TEST CODE PROVIDED: No'}

SOURCE CODE:
\`\`\`${language}
${code}
\`\`\`

${testCode ? `TEST CODE:\n\`\`\`${language}\n${testCode}\n\`\`\`` : ''}

Provide a comprehensive QA report in JSON format:
{
  "executiveSummary": "High-level summary for stakeholders",
  "overallQuality": "Excellent/Good/Fair/Poor",
  "qualityScore": "Score out of 100",
  "readyForProduction": true/false,
  "criticalIssues": ["Critical issue 1"],
  "sections": {
    "codeQuality": {
      "score": "Score out of 100",
      "maintainability": "Assessment",
      "readability": "Assessment",
      "complexity": "Assessment"
    },
    "security": {
      "score": "Score out of 100",
      "vulnerabilities": "Count",
      "riskLevel": "Low/Medium/High/Critical"
    },
    "performance": {
      "score": "Score out of 100",
      "bottlenecks": "Count",
      "scalability": "Assessment"
    },
    "testability": {
      "score": "Score out of 100",
      "coverage": "Estimated coverage",
      "testQuality": "Test quality assessment"
    },
    "documentation": {
      "score": "Score out of 100",
      "completeness": "Assessment",
      "clarity": "Assessment"
    },
    "bestPractices": {
      "score": "Score out of 100",
      "compliance": "Compliance level"
    }
  },
  "defects": [
    {
      "id": "DEF-001",
      "severity": "Critical/High/Medium/Low",
      "category": "Bug/Security/Performance/etc",
      "description": "Defect description",
      "location": "Code location",
      "reproduction": "How to reproduce",
      "recommendation": "How to fix"
    }
  ],
  "testingRecommendations": {
    "unitTests": ["Unit test recommendation 1"],
    "integrationTests": ["Integration test recommendation 1"],
    "e2eTests": ["E2E test recommendation 1"],
    "missingTestCases": ["Missing test case 1"]
  },
  "technicalDebt": {
    "level": "Low/Medium/High",
    "items": [
      {
        "item": "Technical debt item",
        "impact": "Impact on development",
        "effort": "Effort to resolve"
      }
    ]
  },
  "recommendations": [
    {
      "priority": "Critical/High/Medium/Low",
      "category": "Category",
      "recommendation": "Detailed recommendation",
      "effort": "Low/Medium/High",
      "impact": "Expected impact"
    }
  ],
  "releaseReadiness": {
    "blockingIssues": ["Blocking issue 1"],
    "requiredActions": ["Action 1"],
    "riskAssessment": "Risk assessment for release"
  }
}

Respond ONLY with valid JSON.`;
};

export const createArchitectureReviewPrompt = (codeStructure, language, architectureType) => {
  return `You are a Senior Software Architect performing an architecture review.

Review the following code structure and architecture.

ARCHITECTURE TYPE: ${architectureType || 'Not specified'}
LANGUAGE: ${language}

CODE STRUCTURE:
${codeStructure}

Provide an architecture review in JSON format:
{
  "architectureRating": "Excellent/Good/Fair/Poor",
  "score": "Score out of 100",
  "summary": "Architecture assessment summary",
  "architecturePattern": "Detected pattern (MVC/Microservices/Layered/etc)",
  "compliance": {
    "followsPattern": true/false,
    "deviations": ["Deviation 1"]
  },
  "strengths": [
    "Architectural strength 1",
    "Architectural strength 2"
  ],
  "weaknesses": [
    {
      "weakness": "Weakness description",
      "impact": "Impact on system",
      "recommendation": "How to improve"
    }
  ],
  "qualityAttributes": {
    "modularity": {
      "score": "Score out of 10",
      "assessment": "Assessment"
    },
    "cohesion": {
      "score": "Score out of 10",
      "assessment": "Assessment"
    },
    "coupling": {
      "score": "Score out of 10",
      "assessment": "Assessment"
    },
    "scalability": {
      "score": "Score out of 10",
      "assessment": "Assessment"
    },
    "maintainability": {
      "score": "Score out of 10",
      "assessment": "Assessment"
    }
  },
  "layerAnalysis": [
    {
      "layer": "Layer name",
      "purpose": "Layer purpose",
      "issues": ["Issue if any"],
      "recommendations": ["Recommendation if any"]
    }
  ],
  "dependencyAnalysis": {
    "circularDependencies": ["Circular dependency 1"],
    "tightCoupling": ["Tight coupling area 1"],
    "recommendations": ["Recommendation 1"]
  },
  "designPatterns": {
    "used": ["Pattern 1"],
    "recommended": ["Pattern that should be used"],
    "antipatterns": ["Anti-pattern found 1"]
  },
  "recommendations": [
    {
      "priority": "High/Medium/Low",
      "recommendation": "Architecture recommendation",
      "impact": "Expected impact",
      "effort": "Effort required"
    }
  ]
}

Respond ONLY with valid JSON.`;
};

export const createComplianceCheckPrompt = (code, language, standards, industry) => {
  return `You are a Compliance and Standards Expert.

Check compliance of the following ${language} code against specified standards.

STANDARDS: ${standards || 'Industry standard best practices'}
INDUSTRY: ${industry || 'General software'}

CODE:
\`\`\`${language}
${code}
\`\`\`

Provide compliance check report in JSON format:
{
  "overallCompliance": "Compliant/Partially Compliant/Non-Compliant",
  "complianceScore": "Score out of 100",
  "summary": "Compliance summary",
  "standards": [
    {
      "standard": "Standard name (PCI-DSS/HIPAA/GDPR/ISO/etc)",
      "applicable": true/false,
      "compliance": "Compliant/Partial/Non-Compliant",
      "requirements": [
        {
          "requirement": "Specific requirement",
          "met": true/false,
          "evidence": "How it's met or why not",
          "remediation": "How to achieve compliance"
        }
      ]
    }
  ],
  "dataHandling": {
    "personalData": {
      "detected": true/false,
      "protection": "Protection measures",
      "compliance": "GDPR/CCPA compliance"
    },
    "sensitiveData": {
      "types": ["Credit card/Health/etc"],
      "encryption": "Encryption status",
      "compliance": "Compliance status"
    }
  },
  "security": {
    "authentication": "Compliance status",
    "authorization": "Compliance status",
    "dataProtection": "Compliance status",
    "auditLogging": "Compliance status"
  },
  "violations": [
    {
      "severity": "Critical/High/Medium/Low",
      "standard": "Standard violated",
      "requirement": "Specific requirement",
      "violation": "Violation description",
      "impact": "Impact",
      "remediation": "How to fix"
    }
  ],
  "recommendations": [
    {
      "priority": "Critical/High/Medium/Low",
      "recommendation": "Compliance recommendation",
      "standard": "Related standard",
      "effort": "Implementation effort"
    }
  ],
  "certificationReadiness": {
    "ready": true/false,
    "gaps": ["Gap 1"],
    "nextSteps": ["Step 1"]
  }
}

Respond ONLY with valid JSON.`;
};
