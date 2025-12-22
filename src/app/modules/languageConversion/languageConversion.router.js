import express from 'express';
import { languageConversionController } from './languageConversion.controller.js';

const router = express.Router();

router.post(
  '/convert',
  languageConversionController.languageConversionAgentController,
);

export const languageConvAgentRoutes = router;
