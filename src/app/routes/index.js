import express from 'express';
import { authRoutes } from '../modules/auth/auth.route.js';
import { subscriptionRoutes } from '../modules/payment/payment.route.js';
// import { serperAiRoutes } from '../modules/serper/serper.route.js';
import { adminRoutes } from '../modules/admin/admin.route.js';
import { automationRoutes } from '../modules/automations/automations.route.js';
import { dyadAiRoutes } from '../modules/dyad/dyad.route.js';
// import { geminiOpenMemoryAiRoutes } from '../modules/geminiOpenMemory/geminiOpenMemo.route.js';
import { llamaindexRoutes } from '../modules/llamaindex/llamaindex.route.js';
import { openSWERoutes } from '../modules/openSWE/openswe.route.js';
import { parsrRoutes } from '../modules/parsr/parsr.route.js';
import { cyberdeskRoutes } from '../modules/cyberdesk/cyberdesk.route.js';
import { codeEditorRoutes } from '../modules/codeEditor/codeEditor.route.js';
import { geminiCliRoutes } from '../modules/geminiCli/geminiCli.route.js';
// import { flowiseRoutes } from '../modules/flowise/flowise.route.js';

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
    path: '/automation',
    route: automationRoutes,
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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
