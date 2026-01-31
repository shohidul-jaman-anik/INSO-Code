// ============================================
// modules/reviewQAAgent/InterfaceLayer/reviewQAController.js
// ============================================
import {
  performCodeReview,
  analyzePerformance,
  reviewBestPractices,
  generateFullQAReport,
  reviewArchitecture,
  checkCompliance
} from '../DomainLayer/reviewQAService.js';

export const handleCodeReview = async (req, res) => {
  try {
    const { code, language, focusAreas } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const review = await performCodeReview({
      code,
      language,
      focusAreas: focusAreas || ['all']
    });

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error performing code review:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handlePerformanceAnalysis = async (req, res) => {
  try {
    const { code, language, expectedLoad } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const analysis = await analyzePerformance({
      code,
      language,
      expectedLoad
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing performance:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleBestPracticesReview = async (req, res) => {
  try {
    const { code, language, standards } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const review = await reviewBestPractices({
      code,
      language,
      standards
    });

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error reviewing best practices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleFullQAReport = async (req, res) => {
  try {
    const { code, language, projectContext, testCode } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const report = await generateFullQAReport({
      code,
      language,
      projectContext,
      testCode
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating full QA report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleArchitectureReview = async (req, res) => {
  try {
    const { codeStructure, language, architectureType } = req.body;

    if (!codeStructure || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code structure and language are required'
      });
    }

    const review = await reviewArchitecture({
      codeStructure,
      language,
      architectureType
    });

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error reviewing architecture:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const handleComplianceCheck = async (req, res) => {
  try {
    const { code, language, standards, industry } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const compliance = await checkCompliance({
      code,
      language,
      standards,
      industry
    });

    res.json({
      success: true,
      data: compliance
    });
  } catch (error) {
    console.error('Error checking compliance:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

