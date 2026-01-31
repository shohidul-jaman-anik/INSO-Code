// ============================================
// ROUTES
// ============================================

// routes/openwork.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { requireWorkspace } from '../middleware/workspace.js';
import {
  approveToolCallAction,
  createAgent,
  deleteAgent,
  getAgentById,
  getConversation,
  getMyAgents,
  getMyConversations,
  getPendingToolCalls,
  getToolCallsByConversation,
  rejectToolCallAction,
  sendMessageToAgent,
  startConversation,
  updateAgent,
} from './openwork.controller.js';

const router = express.Router();

// All routes require authentication and workspace access
router.use(authenticate);
router.use(requireWorkspace);

// Agent Management
router.post('/agents', requirePermission('ai.create'), createAgent);
router.get('/agents', getMyAgents);
router.get('/agents/:agentId', getAgentById);
router.put('/agents/:agentId', requirePermission('ai.update'), updateAgent);
router.delete('/agents/:agentId', requirePermission('ai.delete'), deleteAgent);

// Conversations
router.post('/conversations', requirePermission('ai.chat'), startConversation);
router.post('/conversations/:conversationId/messages', sendMessageToAgent);
router.get('/conversations/:conversationId', getConversation);
router.get('/conversations', getMyConversations);

// Tool Calls (Approval System)
router.get('/tool-calls/pending', getPendingToolCalls);
router.post('/tool-calls/:toolCallId/approve', approveToolCallAction);
router.post('/tool-calls/:toolCallId/reject', rejectToolCallAction);
router.get('/tool-calls/:conversationId', getToolCallsByConversation);

export const openworkRoutes = router;
