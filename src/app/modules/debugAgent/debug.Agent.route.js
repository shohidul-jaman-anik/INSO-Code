// modules/debugAgent/debug.Agent.route.js
import express from 'express';
import { debugController } from './InterfaceLayer/debugController.js';

const router = express.Router();

// Core debugging endpoints
router.post('/analyze', debugController.handleAnalyzeApplication);
router.post('/architecture', debugController.handleGenerateArchitecture);
router.post('/diagnose', debugController.handleDiagnoseIssue);
router.post('/trace', debugController.handleTraceExecution);
router.post('/suggest-fixes', debugController.handleSuggestFixes);
router.post('/performance', debugController.handleAnalyzePerformance);
router.post('/security', debugController.handleSecurityAudit);

export const debugAgentRoutes = router;