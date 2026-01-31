// ============================================
// modules/languageConversionAgent/language.conversion.agent.route.js
// ============================================
import express from 'express';
import {
  handleAnalyzeCompatibility,
  handleBatchConvert,
  handleConvertAndOptimize,
  handleConvertCode,
  handleConvertWithContext,
  handleGenerateMigrationPlan,
} from './InterfaceLayer/languageConversionController.js';

const router = express.Router();

router.post('/convert', handleConvertCode);
router.post('/convert-with-context', handleConvertWithContext);
router.post('/batch-convert', handleBatchConvert);
router.post('/analyze-compatibility', handleAnalyzeCompatibility);
router.post('/migration-plan', handleGenerateMigrationPlan);
router.post('/convert-optimize', handleConvertAndOptimize);

export const languageConversionAgentRoutes = router;
