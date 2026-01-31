// ============================================
// 2. DATABASE MODELS
// ============================================

// models/AIAgent.model.js
import mongoose from 'mongoose';

const AIAgentSchema = new mongoose.Schema(
  {
    // Ownership
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Agent Configuration
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,

    // Model Configuration
    provider: {
      type: String,
      enum: ['anthropic', 'openai', 'google'],
      required: true,
    },
    model: {
      type: String,
      required: true,
    },

    // Agent Settings
    systemPrompt: {
      type: String,
      default: 'You are a helpful AI assistant with filesystem access.',
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2,
    },
    maxTokens: {
      type: Number,
      default: 4096,
    },

    // Capabilities & Permissions
    capabilities: {
      filesystemAccess: { type: Boolean, default: false },
      shellCommands: { type: Boolean, default: false },
      webSearch: { type: Boolean, default: true },
      subagentDelegation: { type: Boolean, default: false },
      planning: { type: Boolean, default: true },
    },

    // Security Restrictions
    restrictions: {
      allowedPaths: [String], // Whitelist of allowed directories
      blockedPaths: [String], // Blacklist of forbidden directories
      allowedCommands: [String], // Whitelist of allowed shell commands
      blockedCommands: [String], // Blacklist of forbidden commands
      requireApproval: {
        filesystem: { type: Boolean, default: true },
        shellCommands: { type: Boolean, default: true },
        webRequests: { type: Boolean, default: false },
      },
    },

    // Usage Tracking
    usage: {
      totalTokens: { type: Number, default: 0 },
      totalRequests: { type: Number, default: 0 },
      totalCost: { type: Number, default: 0 },
      lastUsedAt: Date,
    },

    // Status
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Indexes
AIAgentSchema.index({ workspaceId: 1, userId: 1 });
AIAgentSchema.index({ provider: 1, model: 1 });

export const AIAgentModel = mongoose.model('AIAgent', AIAgentSchema);

// models/AIConversation.model.js
const AIConversationSchema = new mongoose.Schema(
  {
    // Ownership
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIAgent',
      required: true,
      index: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Conversation Data
    title: String,
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant', 'system', 'tool'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        toolCalls: [
          {
            id: String,
            type: String,
            function: {
              name: String,
              arguments: String,
            },
          },
        ],
        toolResults: [
          {
            toolCallId: String,
            output: String,
            approved: Boolean,
            approvedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            approvedAt: Date,
          },
        ],
        timestamp: {
          type: Date,
          default: Date.now,
        },
        tokens: {
          input: Number,
          output: Number,
          total: Number,
        },
      },
    ],

    // Metadata
    totalTokens: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },

    // Status
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

AIConversationSchema.index({ agentId: 1, userId: 1 });
AIConversationSchema.index({ workspaceId: 1, createdAt: -1 });

export const AIConversationModel = mongoose.model(
  'AIConversation',
  AIConversationSchema,
);

// models/AIToolCall.model.js
const AIToolCallSchema = new mongoose.Schema(
  {
    // References
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIConversation',
      required: true,
      index: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Tool Call Details
    toolName: {
      type: String,
      required: true,
      enum: [
        'read_file',
        'write_file',
        'list_directory',
        'execute_command',
        'search_web',
        'create_agent',
        'delegate_task',
      ],
    },
    arguments: mongoose.Schema.Types.Mixed,

    // Execution
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'executed', 'failed'],
      default: 'pending',
    },
    result: mongoose.Schema.Types.Mixed,
    error: String,

    // Approval Workflow
    requiresApproval: { type: Boolean, default: true },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: Date,
    rejectionReason: String,

    // Security
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    securityChecks: {
      pathValidation: Boolean,
      commandValidation: Boolean,
      permissionCheck: Boolean,
    },

    // Execution Details
    executedAt: Date,
    executionTime: Number, // milliseconds
    exitCode: Number,
  },
  {
    timestamps: true,
  },
);

AIToolCallSchema.index({ conversationId: 1, status: 1 });
AIToolCallSchema.index({ workspaceId: 1, userId: 1, createdAt: -1 });

export const AIToolCallModel = mongoose.model('AIToolCall', AIToolCallSchema);
