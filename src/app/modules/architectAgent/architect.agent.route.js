// ============================================
// modules/architectAgent/architect.agent.route.js
// ============================================
import express from 'express';
import {
  handleAnalyzeRequirements,
  handleCreateAPISpec,
  handleDesignDatabase,
  handleEvaluateArchitecture,
  handleGenerateArchitecture,
  handleSuggestTechStack,
} from './InterfaceLayer/architectController.js';

const router = express.Router();

router.post('/analyze-requirements', handleAnalyzeRequirements);
router.post('/generate-architecture', handleGenerateArchitecture);
router.post('/suggest-tech-stack', handleSuggestTechStack);
router.post('/design-database', handleDesignDatabase);
router.post('/create-api-specification', handleCreateAPISpec);
router.post('/evaluate-architecture', handleEvaluateArchitecture);

export const architectAgentRoutes = router;
