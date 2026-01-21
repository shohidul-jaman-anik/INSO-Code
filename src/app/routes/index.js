import express from 'express';
import { authRoutes } from '../modules/auth/auth.route.js';
import { subscriptionRoutes } from '../modules/payment/payment.route.js';
import { adminRoutes } from '../modules/admin/admin.route.js';
import { dyadAiRoutes } from '../modules/dyad/dyad.route.js';
import { codeEditorRoutes } from '../modules/codeEditor/codeEditor.route.js';
import { cyberdeskRoutes } from '../modules/cyberdesk/cyberdesk.route.js';
import { geminiCliRoutes } from '../modules/geminiCli/geminiCli.route.js';
import { llamaindexRoutes } from '../modules/llamaindex/llamaindex.route.js';
import { openAiRoutes } from '../modules/openAiAgent/openAiAgent.router.js';
import { openSWERoutes } from '../modules/openSWE/openswe.route.js';
import { parsrRoutes } from '../modules/parsr/parsr.route.js';
import { geminiAiRoutes } from '../modules/gemini/gemini.route.js';
import { languageConvAgentRoutes } from '../modules/languageConversion/languageConversion.router.js';
import { documentationAgentRoutes } from '../modules/documentationAgent/documentation.Agent.route.js';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/parsr',
    route: parsrRoutes,
  },
  {
    path: '/open-swe',
    route: openSWERoutes,
  },
  {
    path: '/subscription',
    route: subscriptionRoutes,
  },
  {
    path: '/cyberdesk',
    route: cyberdeskRoutes,
  },
  {
    path: '/rag-system',
    route: llamaindexRoutes,
  },
  {
    path: '/code-editor',
    route: codeEditorRoutes,
  },
  {
    path: '/dyad/claude',
    route: dyadAiRoutes,
  },
  {
    path: '/gemini-cli',
    route: geminiCliRoutes,
  },
  {
    path: '/openai',
    route: openAiRoutes,
  },
  {
    path: '/gemini',
    route: geminiAiRoutes,
  },
  {
    path: '/language-convention',
    route: languageConvAgentRoutes,
  },
  {
    path: '/documentation-agent',
    route: documentationAgentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
