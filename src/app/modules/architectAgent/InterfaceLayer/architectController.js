// ============================================
// modules/architectAgent/InterfaceLayer/architectController.js
// ============================================
import {
  analyzeRequirements,
  createAPISpecification,
  designDatabase,
  evaluateArchitecture,
  generateArchitecture,
  suggestTechStack,
} from '../DomainLayer/architectService.js';

export const handleAnalyzeRequirements = async (req, res) => {
  try {
    const { requirements, projectType, constraints } = req.body;

    if (!requirements) {
      return res.status(400).json({
        success: false,
        error: 'Requirements are required',
      });
    }

    const analysis = await analyzeRequirements({
      requirements,
      projectType,
      constraints,
    });

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error analyzing requirements:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleGenerateArchitecture = async (req, res) => {
  try {
    const { requirements, projectType, scale, preferences } = req.body;

    if (!requirements) {
      return res.status(400).json({
        success: false,
        error: 'Requirements are required',
      });
    }

    const architecture = await generateArchitecture({
      requirements,
      projectType,
      scale,
      preferences,
    });

    res.json({
      success: true,
      data: architecture,
    });
  } catch (error) {
    console.error('Error generating architecture:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleSuggestTechStack = async (req, res) => {
  try {
    const { requirements, constraints, teamSkills } = req.body;

    const techStack = await suggestTechStack({
      requirements,
      constraints,
      teamSkills,
    });

    res.json({
      success: true,
      data: techStack,
    });
  } catch (error) {
    console.error('Error suggesting tech stack:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleDesignDatabase = async (req, res) => {
  try {
    const { entities, relationships, scalability } = req.body;

    const databaseDesign = await designDatabase({
      entities,
      relationships,
      scalability,
    });

    res.json({
      success: true,
      data: databaseDesign,
    });
  } catch (error) {
    console.error('Error designing database:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleCreateAPISpec = async (req, res) => {
  try {
    const { features, architecture, format } = req.body;

    const apiSpec = await createAPISpecification({
      features,
      architecture,
      format: format || 'OpenAPI',
    });

    res.json({
      success: true,
      data: apiSpec,
    });
  } catch (error) {
    console.error('Error creating API specification:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleEvaluateArchitecture = async (req, res) => {
  try {
    const { architecture, criteria } = req.body;

    const evaluation = await evaluateArchitecture({
      architecture,
      criteria,
    });

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('Error evaluating architecture:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
