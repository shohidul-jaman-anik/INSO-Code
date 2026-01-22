// modules/refactoringAgent/refactoring.Agent.route.js
import express from 'express';
import { refactoringController } from './InterfaceLayer/refactoringController.js';

const router = express.Router();

router.post('/analyze', refactoringController.handleAnalyzeCodeSmells);
router.post('/plan', refactoringController.handleGenerateRefactoringPlan);
router.post('/apply', refactoringController.handleApplyRefactoring);
router.post('/apply-batch', refactoringController.handleApplyBatchRefactoring);
router.post('/architecture', refactoringController.handleAnalyzeArchitecture);

export const refactoringAgentRoutes = router;

