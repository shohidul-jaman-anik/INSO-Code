// modules/documentationAgent/documentation.Agent.route.js

import express from 'express';
import { documentationController } from './InterfaceLayer/documentationController.js';

const router = express.Router();

router.post('/analyze', documentationController.handleAnalyzeProject);
router.post('/generate', documentationController.handleGenerateDocumentation);
router.post('/validate', documentationController.handleValidateStandards);
router.post(
  '/generate-full-project',
  documentationController.handleGenerateFullProjectDocumentation,
);

export const documentationAgentRoutes = router;
