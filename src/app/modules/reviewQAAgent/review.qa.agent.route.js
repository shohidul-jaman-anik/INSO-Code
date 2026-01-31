// ============================================
// modules/reviewQAAgent/review.qa.agent.route.js
// ============================================
import express from 'express';
import {
  handleCodeReview,
  handlePerformanceAnalysis,
  handleBestPracticesReview,
  handleFullQAReport,
  handleArchitectureReview,
  handleComplianceCheck
} from './InterfaceLayer/reviewQAController.js';

const router = express.Router();

router.post('/code-review', handleCodeReview);
router.post('/performance-analysis', handlePerformanceAnalysis);
router.post('/best-practices', handleBestPracticesReview);
router.post('/full-qa-report', handleFullQAReport);
router.post('/architecture-review', handleArchitectureReview);
router.post('/compliance-check', handleComplianceCheck);

export const reviewQAAgentRoutes = router;