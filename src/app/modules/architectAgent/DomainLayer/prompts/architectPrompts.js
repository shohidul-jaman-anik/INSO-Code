// ============================================
// modules/architectAgent/DomainLayer/prompts/architectPrompts.js
// ============================================
export const createAnalyzeRequirementsPrompt = (
  requirements,
  projectType,
  constraints,
) => {
  return `You are a Senior Software Architect with 15+ years of experience in enterprise software design.

Analyze the following application requirements and provide a comprehensive analysis.

PROJECT TYPE: ${projectType || 'Not specified'}
CONSTRAINTS: ${constraints || 'None specified'}

REQUIREMENTS:
${requirements}

Provide your analysis in JSON format with the following structure:
{
  "projectSummary": {
    "name": "Suggested project name",
    "type": "Application type (e.g., Web App, Mobile App, SaaS, etc.)",
    "domain": "Business domain",
    "complexity": "Low/Medium/High/Enterprise"
  },
  "functionalRequirements": [
    {
      "category": "Category name",
      "features": ["feature 1", "feature 2"]
    }
  ],
  "nonFunctionalRequirements": {
    "performance": "Performance requirements",
    "scalability": "Scalability needs",
    "security": "Security requirements",
    "availability": "Availability requirements"
  },
  "stakeholders": ["Stakeholder types"],
  "risksAndChallenges": [
    {
      "risk": "Risk description",
      "impact": "High/Medium/Low",
      "mitigation": "Mitigation strategy"
    }
  ],
  "estimations": {
    "teamSize": "Recommended team size",
    "duration": "Estimated timeline",
    "phases": ["Phase 1", "Phase 2"]
  }
}

Respond ONLY with valid JSON, no preamble or explanation.`;
};

export const createGenerateArchitecturePrompt = (
  requirements,
  projectType,
  scale,
  preferences,
) => {
  return `You are a Senior Software Architect specializing in scalable, maintainable system design.

Design a comprehensive software architecture for the following application.

PROJECT TYPE: ${projectType || 'Not specified'}
SCALE: ${scale || 'Medium'}
PREFERENCES: ${preferences || 'Industry best practices'}

REQUIREMENTS:
${requirements}

Provide a complete architecture plan in JSON format:
{
  "architectureStyle": "Architecture pattern (e.g., Microservices, Monolith, Serverless, Event-Driven)",
  "rationale": "Why this architecture was chosen",
  "systemOverview": {
    "description": "High-level system description",
    "keyPrinciples": ["Principle 1", "Principle 2"]
  },
  "layers": [
    {
      "name": "Layer name (e.g., Presentation, Business Logic, Data)",
      "responsibilities": ["Responsibility 1", "Responsibility 2"],
      "components": ["Component 1", "Component 2"],
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "components": [
    {
      "name": "Component name",
      "type": "Service/Module/Library",
      "purpose": "Component purpose",
      "responsibilities": ["Responsibility 1"],
      "interfaces": ["Interface descriptions"],
      "dependencies": ["Dependency 1"]
    }
  ],
  "dataFlow": {
    "description": "How data flows through the system",
    "patterns": ["Pattern 1", "Pattern 2"]
  },
  "integrations": [
    {
      "system": "External system name",
      "method": "Integration method (REST, GraphQL, Message Queue, etc.)",
      "purpose": "Integration purpose"
    }
  ],
  "securityArchitecture": {
    "authentication": "Authentication strategy",
    "authorization": "Authorization approach",
    "dataProtection": "Data protection measures",
    "compliance": ["Compliance requirements"]
  },
  "scalabilityStrategy": {
    "horizontal": "Horizontal scaling approach",
    "vertical": "Vertical scaling approach",
    "caching": "Caching strategy",
    "loadBalancing": "Load balancing approach"
  },
  "deploymentArchitecture": {
    "infrastructure": "Infrastructure type (Cloud, On-premise, Hybrid)",
    "containerization": "Containerization strategy",
    "orchestration": "Orchestration approach",
    "cicd": "CI/CD pipeline approach"
  }
}

Respond ONLY with valid JSON.`;
};

export const createSuggestTechStackPrompt = (
  requirements,
  constraints,
  teamSkills,
) => {
  return `You are a Senior Software Architect specializing in technology selection and team enablement.

Suggest an optimal technology stack for the following requirements.

REQUIREMENTS:
${requirements}

CONSTRAINTS: ${constraints || 'None specified'}
TEAM SKILLS: ${teamSkills || 'Not specified'}

Provide technology recommendations in JSON format:
{
  "frontend": {
    "framework": "Framework name",
    "rationale": "Why this framework",
    "libraries": [
      {
        "name": "Library name",
        "purpose": "Library purpose",
        "alternatives": ["Alternative 1"]
      }
    ],
    "stateManagement": "State management solution",
    "styling": "Styling approach"
  },
  "backend": {
    "language": "Programming language",
    "framework": "Framework name",
    "rationale": "Why this stack",
    "libraries": [
      {
        "name": "Library name",
        "purpose": "Library purpose"
      }
    ]
  },
  "database": {
    "primary": {
      "type": "Database type",
      "name": "Database name",
      "rationale": "Why this database"
    },
    "cache": "Caching solution",
    "searchEngine": "Search engine if needed"
  },
  "infrastructure": {
    "hosting": "Hosting platform",
    "containerization": "Container technology",
    "orchestration": "Orchestration platform",
    "cicd": "CI/CD tools"
  },
  "thirdPartyServices": [
    {
      "category": "Service category",
      "service": "Service name",
      "purpose": "Why needed"
    }
  ],
  "devTools": {
    "versionControl": "Version control system",
    "testing": ["Testing frameworks"],
    "monitoring": ["Monitoring tools"],
    "logging": "Logging solution"
  },
  "learningCurve": {
    "overall": "Low/Medium/High",
    "recommendations": ["Learning resource 1"]
  }
}

Respond ONLY with valid JSON.`;
};

export const createDesignDatabasePrompt = (
  entities,
  relationships,
  scalability,
) => {
  return `You are a Senior Database Architect specializing in data modeling and optimization.

Design a database schema for the following requirements.

ENTITIES: ${entities}
RELATIONSHIPS: ${relationships}
SCALABILITY REQUIREMENTS: ${scalability || 'Medium scale'}

Provide database design in JSON format:
{
  "databaseType": "SQL/NoSQL/Hybrid",
  "rationale": "Why this database type",
  "schema": {
    "tables": [
      {
        "name": "Table name",
        "purpose": "Table purpose",
        "columns": [
          {
            "name": "Column name",
            "type": "Data type",
            "constraints": ["Constraint 1"],
            "indexed": true/false
          }
        ],
        "primaryKey": "Primary key column(s)",
        "foreignKeys": [
          {
            "column": "Foreign key column",
            "references": "Referenced table",
            "onDelete": "CASCADE/SET NULL/etc"
          }
        ],
        "indexes": [
          {
            "name": "Index name",
            "columns": ["Column 1"],
            "type": "BTREE/HASH/etc"
          }
        ]
      }
    ],
    "relationships": [
      {
        "type": "One-to-Many/Many-to-Many/etc",
        "from": "Table 1",
        "to": "Table 2",
        "description": "Relationship description"
      }
    ]
  },
  "dataIntegrity": {
    "constraints": ["Constraint 1"],
    "validationRules": ["Rule 1"]
  },
  "optimization": {
    "indexingStrategy": "Indexing approach",
    "partitioning": "Partitioning strategy",
    "archiving": "Data archiving approach"
  },
  "scalability": {
    "sharding": "Sharding strategy if needed",
    "replication": "Replication approach",
    "caching": "Caching strategy"
  },
  "backup": {
    "strategy": "Backup strategy",
    "frequency": "Backup frequency",
    "retention": "Retention period"
  }
}

Respond ONLY with valid JSON.`;
};

export const createAPISpecPrompt = (features, architecture, format) => {
  return `You are a Senior API Architect specializing in RESTful and GraphQL API design.

Create an API specification for the following application.

FEATURES: ${features}
ARCHITECTURE: ${architecture}
FORMAT: ${format}

Provide API specification in JSON format:
{
  "apiStyle": "REST/GraphQL/gRPC",
  "version": "API version",
  "baseUrl": "Base URL pattern",
  "authentication": {
    "method": "Authentication method",
    "details": "Authentication details"
  },
  "endpoints": [
    {
      "path": "Endpoint path",
      "method": "HTTP method",
      "description": "Endpoint description",
      "authentication": "Required/Optional/None",
      "requestBody": {
        "contentType": "application/json",
        "schema": {
          "field1": "type",
          "field2": "type"
        }
      },
      "responses": [
        {
          "status": 200,
          "description": "Success response",
          "schema": {
            "field1": "type"
          }
        }
      ],
      "queryParameters": [
        {
          "name": "Parameter name",
          "type": "Parameter type",
          "required": true/false,
          "description": "Parameter description"
        }
      ]
    }
  ],
  "dataModels": [
    {
      "name": "Model name",
      "description": "Model description",
      "properties": {
        "field1": {
          "type": "Data type",
          "description": "Field description",
          "required": true/false
        }
      }
    }
  ],
  "errorHandling": {
    "standardErrors": [
      {
        "code": "Error code",
        "message": "Error message",
        "httpStatus": 400
      }
    ]
  },
  "rateLimiting": {
    "strategy": "Rate limiting strategy",
    "limits": "Rate limits"
  },
  "versioning": {
    "strategy": "Versioning strategy",
    "approach": "URL/Header/etc"
  }
}

Respond ONLY with valid JSON.`;
};

export const createEvaluateArchitecturePrompt = (architecture, criteria) => {
  return `You are a Senior Software Architect performing architecture review and evaluation.

Evaluate the following architecture against industry best practices.

ARCHITECTURE:
${architecture}

EVALUATION CRITERIA: ${criteria || 'Standard best practices'}

Provide evaluation in JSON format:
{
  "overallScore": "Score out of 10",
  "summary": "Overall assessment summary",
  "strengths": [
    {
      "aspect": "Strength aspect",
      "description": "Why this is strong"
    }
  ],
  "weaknesses": [
    {
      "aspect": "Weakness aspect",
      "severity": "High/Medium/Low",
      "description": "Issue description",
      "recommendation": "How to improve"
    }
  ],
  "qualityAttributes": {
    "maintainability": {
      "score": "Score out of 10",
      "assessment": "Assessment details"
    },
    "scalability": {
      "score": "Score out of 10",
      "assessment": "Assessment details"
    },
    "performance": {
      "score": "Score out of 10",
      "assessment": "Assessment details"
    },
    "security": {
      "score": "Score out of 10",
      "assessment": "Assessment details"
    },
    "testability": {
      "score": "Score out of 10",
      "assessment": "Assessment details"
    }
  },
  "bestPracticesCompliance": [
    {
      "practice": "Best practice name",
      "compliant": true/false,
      "notes": "Additional notes"
    }
  ],
  "recommendations": [
    {
      "priority": "High/Medium/Low",
      "category": "Category",
      "recommendation": "Detailed recommendation",
      "expectedImpact": "Expected impact"
    }
  ],
  "technicalDebt": {
    "level": "Low/Medium/High",
    "areas": ["Area 1", "Area 2"],
    "remediationPlan": "How to address technical debt"
  }
}

Respond ONLY with valid JSON.`;
};
