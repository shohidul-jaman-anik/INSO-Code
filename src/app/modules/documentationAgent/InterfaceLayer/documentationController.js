// InterfaceLayer/documentationController.js
import { AnalyzeProjectDocumentations } from '../ApplicationLayer/analyzeProjectDocumentation.js';
import { GenerateDocumentations } from '../ApplicationLayer/generateDocumentation.js';
import { GenerateProjectDocumentations } from '../ApplicationLayer/generateProjectDocumentation.js';
import { ValidateDocumentationStandard } from '../ApplicationLayer/validateDocumentationStandards.js';

const handleAnalyzeProject = async (req, res) => {
  try {
    const { projectPath, config } = req.body;
    const result =
      await AnalyzeProjectDocumentations.analyzeProjectDocumentation(
        projectPath,
        config,
      );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const handleGenerateDocumentation = async (req, res) => {
  try {
    const { codeElements, config } = req.body;
    const result = await GenerateDocumentations.generateDocumentation(
      codeElements,
      config,
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const handleValidateStandards = async (req, res) => {
  try {
    const { projectPath, config } = req.body;
    const result =
      await ValidateDocumentationStandard.validateDocumentationStandards(
        projectPath,
        config,
      );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const handleGenerateFullProjectDocumentation = async (req, res) => {
  try {
    const { projectPath, config } = req.body;
    const result =
      await GenerateProjectDocumentations.generateProjectDocumentation(
        projectPath,
        config,
      );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const documentationController = {
  handleAnalyzeProject,
  handleGenerateDocumentation,
  handleValidateStandards,
  handleGenerateFullProjectDocumentation,
};
