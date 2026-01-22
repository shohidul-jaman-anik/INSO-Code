// modules/refactoringAgent/InterfaceLayer/refactoringController.js
import { analyzeArchitecture } from '../ApplicationLayer/useCases/analyzeArchitecture.js';
import { analyzeCodeSmells } from '../ApplicationLayer/useCases/analyzeCodeSmells.js';
import { applyRefactoring } from '../ApplicationLayer/useCases/applyRefactoring.js';
import { generateRefactoringPlan } from '../ApplicationLayer/useCases/generateRefactoringPlan.js';

const handleAnalyzeCodeSmells = async (req, res) => {
  try {
    const { projectPath, config = {} } = req.body;

    if (!projectPath) {
      return res.status(400).json({
        success: false,
        error: 'projectPath is required',
      });
    }

    const result = await analyzeCodeSmells(projectPath, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const handleGenerateRefactoringPlan = async (req, res) => {
  try {
    const { codeSmells, config = {} } = req.body;

    if (!codeSmells || !Array.isArray(codeSmells)) {
      return res.status(400).json({
        success: false,
        error: 'codeSmells array is required',
      });
    }

    const result = await generateRefactoringPlan(codeSmells, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const handleApplyRefactoring = async (req, res) => {
  try {
    const { task, config = {} } = req.body;

    if (!task) {
      return res.status(400).json({
        success: false,
        error: 'task object is required',
      });
    }

    const result = await applyRefactoring(task, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const handleAnalyzeArchitecture = async (req, res) => {
  try {
    const { projectPath } = req.body;

    if (!projectPath) {
      return res.status(400).json({
        success: false,
        error: 'projectPath is required',
      });
    }

    const result = await analyzeArchitecture(projectPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const handleApplyBatchRefactoring = async (req, res) => {
  try {
    const { tasks, config = {} } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        error: 'tasks array is required',
      });
    }

    const results = [];
    for (const task of tasks) {
      const result = await applyRefactoring(task, config);
      results.push(result);
    }

    res.json({
      success: true,
      data: {
        total: tasks.length,
        completed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const refactoringController = {
  handleAnalyzeCodeSmells,
  handleGenerateRefactoringPlan,
  handleApplyRefactoring,
  handleAnalyzeArchitecture,
  handleApplyBatchRefactoring,
};

export { refactoringController };
