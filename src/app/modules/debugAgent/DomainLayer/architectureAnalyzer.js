// modules/debugAgent/DomainLayer/architectureAnalyzer.js
class ArchitectureAnalyzer {
  /**
   * Analyze application architecture from details
   */
  async analyze(applicationDetails) {
    const { codebase, dependencies, structure, technologies } =
      this._extractArchitectureInfo(applicationDetails);

    return {
      layers: this._identifyLayers(structure),
      patterns: this._identifyPatterns(codebase, structure),
      dependencies: this._analyzeDependencies(dependencies),
      technologies: this._categorizeTechnologies(technologies),
      complexity: this._calculateComplexity(structure, dependencies),
      modularity: this._assessModularity(structure),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Extract architecture information from application details
   */
  _extractArchitectureInfo(applicationDetails) {
    const codebase =
      applicationDetails.codebase || applicationDetails.code || {};
    const dependencies =
      applicationDetails.dependencies ||
      applicationDetails.packages ||
      applicationDetails.libraries ||
      [];
    const structure =
      applicationDetails.structure ||
      applicationDetails.fileStructure ||
      applicationDetails.directories ||
      {};
    const technologies =
      applicationDetails.technologies ||
      applicationDetails.stack ||
      applicationDetails.techStack ||
      [];

    return { codebase, dependencies, structure, technologies };
  }

  /**
   * Identify architectural layers
   */
  _identifyLayers(structure) {
    const layers = [];
    const structureStr = JSON.stringify(structure).toLowerCase();

    // Common layer patterns
    const layerPatterns = {
      presentation: [
        'controller',
        'view',
        'ui',
        'frontend',
        'component',
        'page',
      ],
      application: ['service', 'usecase', 'application', 'business'],
      domain: ['domain', 'model', 'entity', 'core'],
      infrastructure: ['repository', 'dao', 'database', 'api', 'integration'],
      data: ['data', 'persistence', 'storage', 'db'],
    };

    for (const [layer, patterns] of Object.entries(layerPatterns)) {
      const hasLayer = patterns.some(pattern => structureStr.includes(pattern));
      if (hasLayer) {
        layers.push({
          name: layer,
          confidence: this._calculateLayerConfidence(structureStr, patterns),
        });
      }
    }

    return layers.length > 0
      ? layers
      : [{ name: 'monolithic', confidence: 0.5 }];
  }

  /**
   * Calculate confidence level for layer detection
   */
  _calculateLayerConfidence(structureStr, patterns) {
    const matches = patterns.filter(pattern => structureStr.includes(pattern));
    return Math.min(matches.length / patterns.length, 1);
  }

  /**
   * Identify design patterns
   */
  _identifyPatterns(codebase, structure) {
    const patterns = [];
    const codeStr = JSON.stringify(codebase).toLowerCase();
    const structureStr = JSON.stringify(structure).toLowerCase();

    // Pattern detection
    const patternIndicators = {
      MVC: ['model', 'view', 'controller'],
      Repository: ['repository', 'repositories'],
      'Service Layer': ['service', 'services'],
      Factory: ['factory', 'factories'],
      Singleton: ['singleton', 'instance'],
      Observer: ['observer', 'event', 'listener'],
      Strategy: ['strategy', 'strategies'],
      'Dependency Injection': ['inject', 'di', 'container', 'provider'],
      Middleware: ['middleware', 'interceptor'],
      DTO: ['dto', 'datatransferobject'],
    };

    for (const [pattern, indicators] of Object.entries(patternIndicators)) {
      const hasPattern = indicators.some(
        indicator =>
          codeStr.includes(indicator) || structureStr.includes(indicator),
      );
      if (hasPattern) {
        patterns.push(pattern);
      }
    }

    return patterns;
  }

  /**
   * Analyze dependencies and their relationships
   */
  _analyzeDependencies(dependencies) {
    if (!Array.isArray(dependencies) && typeof dependencies === 'object') {
      dependencies = Object.keys(dependencies);
    }

    return {
      count: dependencies.length,
      categories: this._categorizeDependencies(dependencies),
      potentialIssues: this._identifyDependencyIssues(dependencies),
    };
  }

  /**
   * Categorize dependencies by type
   */
  _categorizeDependencies(dependencies) {
    const categories = {
      frameworks: [],
      databases: [],
      testing: [],
      utilities: [],
      frontend: [],
      backend: [],
      other: [],
    };

    const categoryPatterns = {
      frameworks: [
        'express',
        'fastify',
        'koa',
        'nest',
        'react',
        'vue',
        'angular',
        'next',
        'nuxt',
      ],
      databases: [
        'mysql',
        'postgres',
        'mongodb',
        'redis',
        'mongoose',
        'sequelize',
        'prisma',
      ],
      testing: [
        'jest',
        'mocha',
        'chai',
        'vitest',
        'cypress',
        'playwright',
        'testing-library',
      ],
      utilities: ['lodash', 'axios', 'moment', 'dayjs', 'dotenv', 'nodemon'],
      frontend: [
        'react',
        'vue',
        'angular',
        'svelte',
        'webpack',
        'vite',
        'tailwind',
      ],
      backend: ['express', 'fastify', 'koa', 'nest', 'passport', 'jwt'],
    };

    for (const dep of dependencies) {
      const depLower = dep.toLowerCase();
      let categorized = false;

      for (const [category, patterns] of Object.entries(categoryPatterns)) {
        if (patterns.some(pattern => depLower.includes(pattern))) {
          categories[category].push(dep);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        categories.other.push(dep);
      }
    }

    return categories;
  }

  /**
   * Identify potential dependency issues
   */
  _identifyDependencyIssues(dependencies) {
    const issues = [];

    // Check for too many dependencies
    if (dependencies.length > 50) {
      issues.push({
        type: 'excessive_dependencies',
        severity: 'medium',
        description: `High number of dependencies (${dependencies.length})`,
      });
    }

    return issues;
  }

  /**
   * Categorize technologies
   */
  _categorizeTechnologies(technologies) {
    if (!Array.isArray(technologies)) {
      return {
        frontend: [],
        backend: [],
        database: [],
        infrastructure: [],
        other: [],
      };
    }

    const categories = {
      frontend: [],
      backend: [],
      database: [],
      infrastructure: [],
      other: [],
    };

    const techPatterns = {
      frontend: [
        'react',
        'vue',
        'angular',
        'html',
        'css',
        'javascript',
        'typescript',
        'jsx',
      ],
      backend: [
        'node',
        'express',
        'python',
        'java',
        'go',
        'rust',
        'php',
        'ruby',
      ],
      database: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle'],
      infrastructure: [
        'docker',
        'kubernetes',
        'aws',
        'azure',
        'gcp',
        'nginx',
        'apache',
      ],
    };

    for (const tech of technologies) {
      const techLower = tech.toLowerCase();
      let categorized = false;

      for (const [category, patterns] of Object.entries(techPatterns)) {
        if (patterns.some(pattern => techLower.includes(pattern))) {
          categories[category].push(tech);
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        categories.other.push(tech);
      }
    }

    return categories;
  }

  /**
   * Calculate architectural complexity
   */
  _calculateComplexity(structure, dependencies) {
    const structureDepth = this._calculateDepth(structure);
    const dependencyCount = Array.isArray(dependencies)
      ? dependencies.length
      : Object.keys(dependencies).length;

    let complexity = 'low';
    const complexityScore = structureDepth * 10 + dependencyCount;

    if (complexityScore > 100) {
      complexity = 'high';
    } else if (complexityScore > 50) {
      complexity = 'medium';
    }

    return {
      level: complexity,
      score: complexityScore,
      factors: {
        structureDepth,
        dependencyCount,
      },
    };
  }

  /**
   * Calculate depth of structure
   */
  _calculateDepth(obj, currentDepth = 0) {
    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    let maxDepth = currentDepth;
    for (const value of Object.values(obj)) {
      const depth = this._calculateDepth(value, currentDepth + 1);
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  /**
   * Assess modularity of the architecture
   */
  _assessModularity(structure) {
    const structureStr = JSON.stringify(structure).toLowerCase();

    const modularityIndicators = {
      high: ['modules', 'components', 'services', 'packages'],
      medium: ['lib', 'utils', 'helpers', 'shared'],
      low: ['src', 'app'],
    };

    let score = 0;
    for (const [level, indicators] of Object.entries(modularityIndicators)) {
      const matches = indicators.filter(indicator =>
        structureStr.includes(indicator),
      ).length;

      if (level === 'high') score += matches * 3;
      else if (level === 'medium') score += matches * 2;
      else score += matches;
    }

    let modularity = 'low';
    if (score > 10) modularity = 'high';
    else if (score > 5) modularity = 'medium';

    return {
      level: modularity,
      score,
      indicators: this._getModularityIndicators(structureStr),
    };
  }

  /**
   * Get specific modularity indicators present
   */
  _getModularityIndicators(structureStr) {
    const indicators = [];
    const allIndicators = [
      'modules',
      'components',
      'services',
      'packages',
      'lib',
      'utils',
    ];

    for (const indicator of allIndicators) {
      if (structureStr.includes(indicator)) {
        indicators.push(indicator);
      }
    }

    return indicators;
  }
}

export const architectureAnalyzer = new ArchitectureAnalyzer();
