// ============================================
// CONTROLLER
// ============================================

// controllers/openwork.controller.js
import { openworkService } from '../services/openwork.service.js';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';

export const createAgent = catchAsync(async (req, res) => {
  const { name, description, provider, model, capabilities, restrictions } = req.body;
  
  const agent = await AIAgentModel.create({
    workspaceId: req.workspaceId,
    userId: req.userId,
    name,
    description,
    provider,
    model,
    capabilities,
    restrictions
  });
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'AI Agent created successfully',
    data: agent
  });
});

export const startConversation = catchAsync(async (req, res) => {
  const { agentId, message } = req.body;
  
  const conversation = await openworkService.createConversation({
    agentId,
    userId: req.userId,
    workspaceId: req.workspaceId,
    initialMessage: message
  });
  
  const response = await openworkService.sendMessage({
    conversationId: conversation._id,
    userId: req.userId,
    message
  });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Conversation started',
    data: response
  });
});

export const sendMessageToAgent = catchAsync(async (req, res) => {
  const { conversationId, message } = req.body;
  
  const response = await openworkService.sendMessage({
    conversationId,
    userId: req.userId,
    message
  });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message sent',
    data: response
  });
});

export const approveToolCallAction = catchAsync(async (req, res) => {
  const { toolCallId } = req.params;
  
  const toolCall = await openworkService.approveToolCall({
    toolCallId,
    userId: req.userId
  });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tool call approved and executed',
    data: toolCall
  });
});

export const rejectToolCallAction = catchAsync(async (req, res) => {
  const { toolCallId } = req.params;
  const { reason } = req.body;
  
  const toolCall = await openworkService.rejectToolCall({
    toolCallId,
    userId: req.userId,
    reason
  });
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tool call rejected',
    data: toolCall
  });
});

export const getPendingToolCalls = catchAsync(async (req, res) => {
  const toolCalls = await AIToolCallModel.find({
    workspaceId: req.workspaceId,
    status: 'pending'
  })
    .sort({ createdAt: -1 })
    .limit(50);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pending tool calls fetched',
    data: toolCalls
  });
});