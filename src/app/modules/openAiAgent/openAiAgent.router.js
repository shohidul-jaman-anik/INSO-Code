import express from 'express';
import { openAiController } from './openAiAgent.controller.js';

const router = express.Router();

router.post('/programmer', openAiController.programmerAgentController);

export const openAiRoutes = router;
