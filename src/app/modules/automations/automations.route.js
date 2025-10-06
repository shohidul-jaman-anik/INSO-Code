import express from 'express';
import { AutomationController } from './automations.controller.js';

const router = express.Router();

router.post('/fetch-leads', AutomationController.fetchAndSaveLeads);

export const automationRoutes = router;
