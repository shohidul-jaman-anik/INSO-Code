import express from 'express';
import { openAiController } from './docAgent.controller.js';

const router = express.Router();

router.post('/programmer', openAiController.programmerAgentController);

export const openAiRoutes = router;
