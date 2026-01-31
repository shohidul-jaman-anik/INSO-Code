// ============================================
// 3. OPENWORK SERVICE - CORE INTEGRATION
// ============================================

// services/openwork.service.js
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { exec } from 'child_process';
import fs from 'fs/promises';
import httpStatus from 'http-status';
import OpenAI from 'openai';
import path from 'path';
import { promisify } from 'util';
import ApiError from '../errors/ApiError.js';

const execAsync = promisify(exec);

// Initialize AI clients
const clients = {
  anthropic: null,
  openai: null,
  google: null,
};

const initializeClients = () => {
  if (process.env.ANTHROPIC_API_KEY) {
    clients.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  if (process.env.OPENAI_API_KEY) {
    clients.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  if (process.env.GOOGLE_API_KEY) {
    clients.google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
};

initializeClients();

// ============================================
// TOOL DEFINITIONS (OpenWork Compatible)
// ============================================

const tools = [
  {
    name: 'read_file',
    description: 'Read the contents of a file from the filesystem',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The file path to read',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description: 'Write content to a file on the filesystem',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The file path to write to',
        },
        content: {
          type: 'string',
          description: 'The content to write',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'list_directory',
    description: 'List contents of a directory',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The directory path to list',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'execute_command',
    description: 'Execute a shell command (DANGEROUS - requires approval)',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The shell command to execute',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'search_web',
    description: 'Search the web for information',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
      },
      required: ['query'],
    },
  },
];

// ============================================
// SECURITY VALIDATOR
// ============================================

class SecurityValidator {
  static validatePath(filePath, agent) {
    // Convert to absolute path
    const absolutePath = path.resolve(filePath);

    // Check if path is in allowed directories
    if (agent.restrictions.allowedPaths?.length > 0) {
      const isAllowed = agent.restrictions.allowedPaths.some(allowed =>
        absolutePath.startsWith(path.resolve(allowed)),
      );
      if (!isAllowed) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Path not in allowed directories: ${absolutePath}`,
        );
      }
    }

    // Check if path is in blocked directories
    if (agent.restrictions.blockedPaths?.length > 0) {
      const isBlocked = agent.restrictions.blockedPaths.some(blocked =>
        absolutePath.startsWith(path.resolve(blocked)),
      );
      if (isBlocked) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Path is blocked: ${absolutePath}`,
        );
      }
    }

    // Default system directories to block
    const systemBlocked = ['/etc', '/sys', '/proc', '/root', '/boot'];
    if (systemBlocked.some(blocked => absolutePath.startsWith(blocked))) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `System path is blocked: ${absolutePath}`,
      );
    }

    return absolutePath;
  }

  static validateCommand(command, agent) {
    const lowerCommand = command.toLowerCase();

    // Dangerous commands blacklist
    const dangerousCommands = [
      'rm -rf /',
      'mkfs',
      'dd if=/dev/zero',
      'fork bomb',
      ':(){ :|:& };:',
      'chmod 777',
      'chown',
      'passwd',
      'sudo',
      'su ',
      'shutdown',
      'reboot',
      'halt',
      'init 0',
      'kill -9',
      'pkill',
    ];

    for (const dangerous of dangerousCommands) {
      if (lowerCommand.includes(dangerous)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Dangerous command blocked: ${command}`,
        );
      }
    }

    // Check allowed commands
    if (agent.restrictions.allowedCommands?.length > 0) {
      const baseCommand = command.split(' ')[0];
      if (!agent.restrictions.allowedCommands.includes(baseCommand)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Command not in whitelist: ${baseCommand}`,
        );
      }
    }

    // Check blocked commands
    if (agent.restrictions.blockedCommands?.length > 0) {
      const baseCommand = command.split(' ')[0];
      if (agent.restrictions.blockedCommands.includes(baseCommand)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Command is blocked: ${baseCommand}`,
        );
      }
    }

    return true;
  }

  static assessRiskLevel(toolName, args) {
    switch (toolName) {
      case 'read_file':
        return 'low';
      case 'list_directory':
        return 'low';
      case 'search_web':
        return 'low';
      case 'write_file':
        return 'medium';
      case 'execute_command':
        // Analyze command for risk
        const cmd = args.command?.toLowerCase() || '';
        if (cmd.includes('rm') || cmd.includes('delete')) return 'high';
        if (cmd.includes('chmod') || cmd.includes('chown')) return 'high';
        return 'medium';
      default:
        return 'medium';
    }
  }
}

// ============================================
// TOOL EXECUTOR
// ============================================

class ToolExecutor {
  static async executeReadFile(args, agent) {
    const validPath = SecurityValidator.validatePath(args.path, agent);

    try {
      const content = await fs.readFile(validPath, 'utf-8');
      return {
        success: true,
        path: validPath,
        content,
        size: content.length,
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to read file: ${error.message}`,
      );
    }
  }

  static async executeWriteFile(args, agent) {
    const validPath = SecurityValidator.validatePath(args.path, agent);

    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(validPath), { recursive: true });

      // Write file
      await fs.writeFile(validPath, args.content, 'utf-8');

      return {
        success: true,
        path: validPath,
        size: args.content.length,
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to write file: ${error.message}`,
      );
    }
  }

  static async executeListDirectory(args, agent) {
    const validPath = SecurityValidator.validatePath(args.path, agent);

    try {
      const entries = await fs.readdir(validPath, { withFileTypes: true });

      const files = entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        path: path.join(validPath, entry.name),
      }));

      return {
        success: true,
        path: validPath,
        files,
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to list directory: ${error.message}`,
      );
    }
  }

  static async executeCommand(args, agent) {
    SecurityValidator.validateCommand(args.command, agent);

    try {
      const { stdout, stderr } = await execAsync(args.command, {
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024, // 1MB max output
      });

      return {
        success: true,
        command: args.command,
        stdout,
        stderr,
        exitCode: 0,
      };
    } catch (error) {
      return {
        success: false,
        command: args.command,
        error: error.message,
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        exitCode: error.code || 1,
      };
    }
  }

  static async executeSearchWeb(args) {
    // Integrate with your web search implementation
    // This is a placeholder
    return {
      success: true,
      query: args.query,
      results: [
        {
          title: 'Search result placeholder',
          url: 'https://example.com',
          snippet: 'This would contain actual search results',
        },
      ],
    };
  }

  static async executeTool(toolName, args, agent) {
    switch (toolName) {
      case 'read_file':
        return await this.executeReadFile(args, agent);
      case 'write_file':
        return await this.executeWriteFile(args, agent);
      case 'list_directory':
        return await this.executeListDirectory(args, agent);
      case 'execute_command':
        return await this.executeCommand(args, agent);
      case 'search_web':
        return await this.executeSearchWeb(args);
      default:
        throw new ApiError(httpStatus.BAD_REQUEST, `Unknown tool: ${toolName}`);
    }
  }
}

// ============================================
// OPENWORK AGENT SERVICE
// ============================================

export const createConversation = async ({
  agentId,
  userId,
  workspaceId,
  initialMessage,
}) => {
  const agent = await AIAgentModel.findOne({
    _id: agentId,
    workspaceId,
    isActive: true,
  });

  if (!agent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Agent not found');
  }

  // Check workspace has active subscription
  // ... add subscription check here

  const conversation = await AIConversationModel.create({
    agentId,
    workspaceId,
    userId,
    title: initialMessage.substring(0, 50),
    messages: [
      {
        role: 'user',
        content: initialMessage,
        timestamp: new Date(),
      },
    ],
  });

  return conversation;
};

export const sendMessage = async ({ conversationId, userId, message }) => {
  const conversation = await AIConversationModel.findById(conversationId);

  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }

  const agent = await AIAgentModel.findById(conversation.agentId);

  // Add user message
  conversation.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date(),
  });

  // Get AI response
  const response = await getAIResponse(agent, conversation.messages);

  // Add assistant message
  conversation.messages.push({
    role: 'assistant',
    content: response.content,
    toolCalls: response.toolCalls,
    tokens: response.usage,
    timestamp: new Date(),
  });

  // Update usage
  conversation.totalTokens += response.usage.total;
  agent.usage.totalTokens += response.usage.total;
  agent.usage.totalRequests += 1;
  agent.usage.lastUsedAt = new Date();

  await Promise.all([conversation.save(), agent.save()]);

  // If there are tool calls, create pending tool call records
  if (response.toolCalls?.length > 0) {
    await createToolCallRecords(conversation, response.toolCalls, userId);
  }

  return {
    conversation,
    message: response.content,
    toolCalls: response.toolCalls,
  };
};

const getAIResponse = async (agent, messages) => {
  const formattedMessages = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  switch (agent.provider) {
    case 'anthropic':
      return await getAnthropicResponse(agent, formattedMessages);
    case 'openai':
      return await getOpenAIResponse(agent, formattedMessages);
    case 'google':
      return await getGoogleResponse(agent, formattedMessages);
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unsupported provider');
  }
};

const getAnthropicResponse = async (agent, messages) => {
  if (!clients.anthropic) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'Anthropic client not initialized',
    );
  }

  const enabledTools = tools.filter(tool => {
    if (tool.name.includes('file') && !agent.capabilities.filesystemAccess)
      return false;
    if (tool.name === 'execute_command' && !agent.capabilities.shellCommands)
      return false;
    if (tool.name === 'search_web' && !agent.capabilities.webSearch)
      return false;
    return true;
  });

  const response = await clients.anthropic.messages.create({
    model: agent.model,
    max_tokens: agent.maxTokens,
    temperature: agent.temperature,
    system: agent.systemPrompt,
    messages,
    tools: enabledTools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.parameters,
    })),
  });

  const content = response.content.find(c => c.type === 'text')?.text || '';
  const toolCalls = response.content
    .filter(c => c.type === 'tool_use')
    .map(c => ({
      id: c.id,
      type: 'function',
      function: {
        name: c.name,
        arguments: JSON.stringify(c.input),
      },
    }));

  return {
    content,
    toolCalls,
    usage: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
      total: response.usage.input_tokens + response.usage.output_tokens,
    },
  };
};

const createToolCallRecords = async (conversation, toolCalls, userId) => {
  const agent = await AIAgentModel.findById(conversation.agentId);

  const records = toolCalls.map(tc => {
    const args = JSON.parse(tc.function.arguments);
    const riskLevel = SecurityValidator.assessRiskLevel(tc.function.name, args);

    let requiresApproval = false;
    if (
      tc.function.name.includes('file') &&
      agent.restrictions.requireApproval.filesystem
    ) {
      requiresApproval = true;
    }
    if (
      tc.function.name === 'execute_command' &&
      agent.restrictions.requireApproval.shellCommands
    ) {
      requiresApproval = true;
    }

    return {
      conversationId: conversation._id,
      workspaceId: conversation.workspaceId,
      userId,
      toolName: tc.function.name,
      arguments: args,
      status: requiresApproval ? 'pending' : 'approved',
      requiresApproval,
      riskLevel,
    };
  });

  await AIToolCallModel.insertMany(records);
};

export const approveToolCall = async ({ toolCallId, userId }) => {
  const toolCall = await AIToolCallModel.findById(toolCallId);

  if (!toolCall) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tool call not found');
  }

  if (toolCall.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tool call already processed');
  }

  // Execute the tool
  const agent = await AIAgentModel.findById(
    (await AIConversationModel.findById(toolCall.conversationId)).agentId,
  );

  const startTime = Date.now();

  try {
    const result = await ToolExecutor.executeTool(
      toolCall.toolName,
      toolCall.arguments,
      agent,
    );

    toolCall.status = 'executed';
    toolCall.result = result;
    toolCall.approvedBy = userId;
    toolCall.approvedAt = new Date();
    toolCall.executedAt = new Date();
    toolCall.executionTime = Date.now() - startTime;

    await toolCall.save();

    return toolCall;
  } catch (error) {
    toolCall.status = 'failed';
    toolCall.error = error.message;
    await toolCall.save();
    throw error;
  }
};

export const rejectToolCall = async ({ toolCallId, userId, reason }) => {
  const toolCall = await AIToolCallModel.findById(toolCallId);

  if (!toolCall) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tool call not found');
  }

  toolCall.status = 'rejected';
  toolCall.rejectedBy = userId;
  toolCall.rejectedAt = new Date();
  toolCall.rejectionReason = reason;

  await toolCall.save();

  return toolCall;
};

export const openworkService = {
  createConversation,
  sendMessage,
  approveToolCall,
  rejectToolCall,
};
