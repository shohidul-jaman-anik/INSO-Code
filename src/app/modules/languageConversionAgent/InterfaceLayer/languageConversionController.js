// ============================================
// modules/languageConversionAgent/InterfaceLayer/languageConversionController.js
// ============================================
import {
  convertCode,
  convertWithContext,
  batchConvert,
  analyzeCompatibility,
  generateMigrationPlan,
  convertAndOptimize
} from '../DomainLayer/languageConversionService.js';

export const handleConvertCode = async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage, preserveComments } = req.body;

    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Code, source language, and target language are required'
      });
    }

    const result = await convertCode({
      code,
      sourceLanguage,
      targetLanguage,
      preserveComments: preserveComments !== false
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error converting code:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleConvertWithContext = async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage, dependencies, framework, context } = req.body;

    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Code, source language, and target language are required'
      });
    }

    const result = await convertWithContext({
      code,
      sourceLanguage,
      targetLanguage,
      dependencies,
      framework,
      context
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error converting code with context:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleBatchConvert = async (req, res) => {
  try {
    const { files, sourceLanguage, targetLanguage, maintainStructure } = req.body;

    if (!files || !Array.isArray(files) || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Files array, source language, and target language are required'
      });
    }

    const result = await batchConvert({
      files,
      sourceLanguage,
      targetLanguage,
      maintainStructure: maintainStructure !== false
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error batch converting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleAnalyzeCompatibility = async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage } = req.body;

    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Code, source language, and target language are required'
      });
    }

    const analysis = await analyzeCompatibility({
      code,
      sourceLanguage,
      targetLanguage
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleGenerateMigrationPlan = async (req, res) => {
  try {
    const { projectStructure, sourceLanguage, targetLanguage, complexity } = req.body;

    if (!projectStructure || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Project structure, source language, and target language are required'
      });
    }

    const plan = await generateMigrationPlan({
      projectStructure,
      sourceLanguage,
      targetLanguage,
      complexity
    });

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error generating migration plan:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleConvertAndOptimize = async (req, res) => {
  try {
    const { code, sourceLanguage, targetLanguage, optimizationGoals } = req.body;

    if (!code || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Code, source language, and target language are required'
      });
    }

    const result = await convertAndOptimize({
      code,
      sourceLanguage,
      targetLanguage,
      optimizationGoals
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error converting and optimizing:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};