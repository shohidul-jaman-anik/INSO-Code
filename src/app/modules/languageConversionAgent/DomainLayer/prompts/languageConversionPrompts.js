// ============================================
// modules/languageConversionAgent/DomainLayer/prompts/languageConversionPrompts.js
// ============================================
export const createConvertCodePrompt = (
  code,
  sourceLanguage,
  targetLanguage,
  preserveComments,
) => {
  return `You are an expert software engineer specialized in code translation and language conversion.

Convert the following ${sourceLanguage} code to ${targetLanguage}.

REQUIREMENTS:
- Maintain the exact same functionality and logic
- Use idiomatic ${targetLanguage} patterns and best practices
- Preserve code structure and organization
- ${preserveComments ? 'Keep all comments and documentation' : 'Remove comments'}
- Handle language-specific features appropriately
- Ensure type safety where applicable
- Follow ${targetLanguage} naming conventions

SOURCE CODE (${sourceLanguage}):
\`\`\`
${code}
\`\`\`

Provide the conversion result in JSON format:
{
  "convertedCode": "The converted code in ${targetLanguage}",
  "notes": [
    "Important note about conversion decision 1",
    "Important note about conversion decision 2"
  ],
  "warnings": [
    "Warning about potential issue or difference in behavior"
  ],
  "dependencies": [
    {
      "package": "Package name",
      "version": "Recommended version",
      "purpose": "Why this dependency is needed"
    }
  ],
  "conversionQuality": "High/Medium/Low",
  "manualReviewNeeded": ["Area that needs manual review"],
  "equivalentLibraries": [
    {
      "original": "Library from source language",
      "target": "Equivalent library in target language"
    }
  ]
}

Respond ONLY with valid JSON.`;
};

export const createConvertWithContextPrompt = (
  code,
  sourceLanguage,
  targetLanguage,
  dependencies,
  framework,
  context,
) => {
  return `You are an expert software engineer specialized in code translation with deep understanding of frameworks and ecosystems.

Convert the following ${sourceLanguage} code to ${targetLanguage} considering the project context.

SOURCE LANGUAGE: ${sourceLanguage}
TARGET LANGUAGE: ${targetLanguage}
DEPENDENCIES: ${dependencies || 'None specified'}
FRAMEWORK: ${framework || 'None specified'}
PROJECT CONTEXT: ${context || 'None specified'}

SOURCE CODE:
\`\`\`
${code}
\`\`\`

REQUIREMENTS:
- Maintain exact functionality
- Use appropriate ${targetLanguage} frameworks that match the source framework purpose
- Adapt design patterns to ${targetLanguage} idioms
- Handle async/await, promises, or callbacks appropriately
- Convert error handling to ${targetLanguage} conventions
- Adapt data structures to ${targetLanguage} equivalents
- Preserve API contracts and interfaces

Provide the conversion in JSON format:
{
  "convertedCode": "Converted code",
  "frameworkRecommendations": [
    {
      "originalFramework": "Source framework",
      "recommendedFramework": "Target framework",
      "rationale": "Why this framework"
    }
  ],
  "architecturalChanges": [
    "Change 1: Description",
    "Change 2: Description"
  ],
  "dependencies": [
    {
      "package": "Package name",
      "version": "Version",
      "purpose": "Purpose"
    }
  ],
  "setupInstructions": [
    "Step 1: Instruction",
    "Step 2: Instruction"
  ],
  "testingConsiderations": [
    "Testing consideration 1",
    "Testing consideration 2"
  ],
  "performanceNotes": "Performance implications of the conversion",
  "securityConsiderations": [
    "Security consideration 1"
  ]
}

Respond ONLY with valid JSON.`;
};

export const createAnalyzeCompatibilityPrompt = (
  code,
  sourceLanguage,
  targetLanguage,
) => {
  return `You are an expert in programming language compatibility and feature parity analysis.

Analyze the compatibility of converting the following ${sourceLanguage} code to ${targetLanguage}.

SOURCE CODE (${sourceLanguage}):
\`\`\`
${code}
\`\`\`

TARGET LANGUAGE: ${targetLanguage}

Analyze and provide comprehensive compatibility report in JSON format:
{
  "overallCompatibility": "High/Medium/Low",
  "compatibilityScore": "Score out of 100",
  "summary": "Brief summary of compatibility",
  "directlyConvertible": [
    "Feature 1 that converts directly",
    "Feature 2 that converts directly"
  ],
  "requiresAdaptation": [
    {
      "feature": "Feature name",
      "sourceImplementation": "How it works in source",
      "targetImplementation": "How it should work in target",
      "complexity": "Low/Medium/High"
    }
  ],
  "noDirectEquivalent": [
    {
      "feature": "Feature with no equivalent",
      "workaround": "Suggested workaround",
      "limitations": "Limitations of workaround"
    }
  ],
  "languageFeatureComparison": {
    "typeSystem": {
      "source": "Type system in source",
      "target": "Type system in target",
      "impact": "Impact on conversion"
    },
    "concurrency": {
      "source": "Concurrency model in source",
      "target": "Concurrency model in target",
      "impact": "Impact on conversion"
    },
    "memoryManagement": {
      "source": "Memory management in source",
      "target": "Memory management in target",
      "impact": "Impact on conversion"
    }
  },
  "performanceImplications": [
    "Performance consideration 1",
    "Performance consideration 2"
  ],
  "ecosystemDifferences": [
    "Ecosystem difference 1",
    "Ecosystem difference 2"
  ],
  "recommendedApproach": "Recommended conversion strategy",
  "estimatedEffort": {
    "automatic": "Percentage that can be automated",
    "manual": "Percentage requiring manual work",
    "timeEstimate": "Estimated time"
  }
}

Respond ONLY with valid JSON.`;
};

export const createMigrationPlanPrompt = (
  projectStructure,
  sourceLanguage,
  targetLanguage,
  complexity,
) => {
  return `You are a senior migration architect specializing in large-scale code migrations.

Create a comprehensive migration plan for converting a project from ${sourceLanguage} to ${targetLanguage}.

PROJECT STRUCTURE:
${projectStructure}

SOURCE LANGUAGE: ${sourceLanguage}
TARGET LANGUAGE: ${targetLanguage}
COMPLEXITY: ${complexity || 'Medium'}

Create a detailed migration plan in JSON format:
{
  "migrationStrategy": "Big bang/Phased/Strangler pattern/etc",
  "rationale": "Why this strategy was chosen",
  "phases": [
    {
      "phase": "Phase number",
      "name": "Phase name",
      "duration": "Estimated duration",
      "objectives": ["Objective 1", "Objective 2"],
      "tasks": [
        {
          "task": "Task description",
          "priority": "High/Medium/Low",
          "estimatedHours": "Hours",
          "dependencies": ["Dependency 1"]
        }
      ],
      "deliverables": ["Deliverable 1"],
      "risks": [
        {
          "risk": "Risk description",
          "mitigation": "Mitigation strategy"
        }
      ]
    }
  ],
  "prerequisites": [
    "Prerequisite 1",
    "Prerequisite 2"
  ],
  "teamRequirements": {
    "roles": [
      {
        "role": "Role name",
        "skills": ["Skill 1", "Skill 2"],
        "count": "Number needed"
      }
    ],
    "trainingNeeds": ["Training need 1"]
  },
  "toolsAndInfrastructure": [
    {
      "tool": "Tool name",
      "purpose": "What it's used for",
      "category": "Development/Testing/Deployment/etc"
    }
  ],
  "testingStrategy": {
    "approach": "Testing approach",
    "coverage": "Target coverage percentage",
    "types": ["Unit", "Integration", "E2E", "etc"],
    "automationLevel": "Percentage automated"
  },
  "rollbackPlan": {
    "strategy": "Rollback strategy",
    "triggers": ["Trigger 1", "Trigger 2"],
    "steps": ["Step 1", "Step 2"]
  },
  "successCriteria": [
    {
      "metric": "Metric name",
      "target": "Target value",
      "measurement": "How to measure"
    }
  ],
  "timeline": {
    "totalDuration": "Total estimated time",
    "milestones": [
      {
        "milestone": "Milestone name",
        "date": "Estimated date/week",
        "criteria": "Completion criteria"
      }
    ]
  },
  "budgetEstimate": {
    "development": "Development cost estimate",
    "tooling": "Tooling cost",
    "training": "Training cost",
    "total": "Total estimate"
  },
  "risks": [
    {
      "risk": "Overall project risk",
      "probability": "High/Medium/Low",
      "impact": "High/Medium/Low",
      "mitigation": "Mitigation strategy"
    }
  ]
}

Respond ONLY with valid JSON.`;
};

export const createConvertAndOptimizePrompt = (
  code,
  sourceLanguage,
  targetLanguage,
  optimizationGoals,
) => {
  return `You are an expert software engineer specialized in code conversion and optimization.

Convert the following ${sourceLanguage} code to ${targetLanguage} and optimize it based on the specified goals.

SOURCE CODE (${sourceLanguage}):
\`\`\`
${code}
\`\`\`

TARGET LANGUAGE: ${targetLanguage}
OPTIMIZATION GOALS: ${optimizationGoals || 'Performance, readability, and maintainability'}

REQUIREMENTS:
- Convert code to idiomatic ${targetLanguage}
- Apply ${targetLanguage} best practices
- Optimize based on specified goals
- Improve code quality where possible
- Use modern ${targetLanguage} features
- Ensure type safety and error handling

Provide the result in JSON format:
{
  "convertedCode": "Optimized converted code",
  "originalComplexity": "Big O complexity of original",
  "optimizedComplexity": "Big O complexity of optimized",
  "optimizations": [
    {
      "type": "Optimization type (performance/readability/etc)",
      "description": "What was optimized",
      "benefit": "Expected benefit",
      "tradeoff": "Any tradeoffs made"
    }
  ],
  "modernFeatures": [
    {
      "feature": "${targetLanguage} feature used",
      "replaces": "What it replaced",
      "benefit": "Why it's better"
    }
  ],
  "performanceImprovements": [
    "Performance improvement 1",
    "Performance improvement 2"
  ],
  "codeQualityMetrics": {
    "before": {
      "linesOfCode": "Original LOC",
      "cyclomaticComplexity": "Original complexity",
      "maintainabilityIndex": "Score out of 100"
    },
    "after": {
      "linesOfCode": "New LOC",
      "cyclomaticComplexity": "New complexity",
      "maintainabilityIndex": "Score out of 100"
    }
  },
  "bestPracticesApplied": [
    "Best practice 1",
    "Best practice 2"
  ],
  "additionalRecommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

Respond ONLY with valid JSON.`;
};
