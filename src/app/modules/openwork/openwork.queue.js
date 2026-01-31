// ============================================
// BACKGROUND JOB PROCESSING (Bull Queue)
// ============================================

// queues/openwork.queue.js
import Queue from 'bull';
import { ToolExecutor } from '../services/openwork.service.js';

export const toolExecutionQueue = new Queue('tool-execution', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Process tool execution jobs
toolExecutionQueue.process(async job => {
  const { toolCallId, toolName, arguments: toolArguments, agentId } = job.data;

  try {
    const agent = await AIAgentModel.findById(agentId);
    const result = await ToolExecutor.executeTool(
      toolName,
      toolArguments,
      agent,
    );

    // Update tool call record
    await AIToolCallModel.findByIdAndUpdate(toolCallId, {
      status: 'executed',
      result,
      executedAt: new Date(),
    });

    return { success: true, result };
  } catch (error) {
    await AIToolCallModel.findByIdAndUpdate(toolCallId, {
      status: 'failed',
      error: error.message,
    });

    throw error;
  }
});

// Add job to queue
export const queueToolExecution = async (toolCall, agent) => {
  await toolExecutionQueue.add(
    {
      toolCallId: toolCall._id,
      toolName: toolCall.toolName,
      arguments: toolCall.toolArguments,
      agentId: agent._id,
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  );
};

// ============================================
// RATE LIMITING FOR AI REQUESTS
// ============================================

// middleware/aiRateLimit.js
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import RedisStore from 'rate-limit-redis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Rate limit based on workspace
export const aiRequestLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'ai_rate_limit:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: async req => {
    // Get workspace plan limits
    const workspace = req.workspace;
    const plan = await SubscriptionPlanModel.findById(
      workspace.subscription.planId,
    );
    return plan?.limits?.aiRequests || 10; // Default 10 requests per minute
  },
  keyGenerator: req => `workspace:${req.workspaceId}`,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'AI request rate limit exceeded. Please upgrade your plan.',
    });
  },
});
