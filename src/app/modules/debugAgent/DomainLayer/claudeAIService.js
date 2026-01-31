// modules/debugAgent/DomainLayer/claudeAIService.js
import Anthropic from '@anthropic-ai/sdk';
import { ApiError } from '../../../utils/ApiError.js';

class ClaudeAIService {
  constructor() {
    this.client = null;
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 8000;
  }

  /**
   * Initialize the Anthropic client
   */
  initialize() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new ApiError(500, 'ANTHROPIC_API_KEY is not configured');
    }

    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Send a message to Claude and get structured response
   */
  async sendMessage(prompt, options = {}) {
    try {
      if (!this.client) {
        this.initialize();
      }

      const {
        model = this.model,
        maxTokens = this.maxTokens,
        temperature = 0.7,
        systemPrompt = 'You are a senior software engineer and debugging expert with deep expertise in software architecture, performance optimization, and security.',
      } = options;

      const message = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract the text content from the response
      const responseText = message.content[0].text;

      // Try to parse JSON response if it looks like JSON
      try {
        return JSON.parse(responseText);
      } catch {
        // If not valid JSON, return as structured object
        return {
          response: responseText,
          raw: message.content,
        };
      }
    } catch (error) {
      console.error('Claude AI Service Error:', error);
      throw new ApiError(
        500,
        `Failed to communicate with Claude AI: ${error.message}`,
      );
    }
  }

  /**
   * Send a message with conversation history
   */
  async sendMessageWithHistory(messages, options = {}) {
    try {
      if (!this.client) {
        this.initialize();
      }

      const {
        model = this.model,
        maxTokens = this.maxTokens,
        temperature = 0.7,
        systemPrompt = 'You are a senior software engineer and debugging expert.',
      } = options;

      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages,
      });

      const responseText = response.content[0].text;

      try {
        return JSON.parse(responseText);
      } catch {
        return {
          response: responseText,
          raw: response.content,
        };
      }
    } catch (error) {
      console.error('Claude AI Service Error:', error);
      throw new ApiError(
        500,
        `Failed to communicate with Claude AI: ${error.message}`,
      );
    }
  }

  /**
   * Stream a response from Claude
   */
  async streamMessage(prompt, onChunk, options = {}) {
    try {
      if (!this.client) {
        this.initialize();
      }

      const {
        model = this.model,
        maxTokens = this.maxTokens,
        temperature = 0.7,
        systemPrompt = 'You are a senior software engineer and debugging expert.',
      } = options;

      const stream = await this.client.messages.stream({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      let fullResponse = '';

      stream.on('text', text => {
        fullResponse += text;
        if (onChunk) {
          onChunk(text);
        }
      });

      await stream.finalMessage();

      try {
        return JSON.parse(fullResponse);
      } catch {
        return {
          response: fullResponse,
        };
      }
    } catch (error) {
      console.error('Claude AI Service Error:', error);
      throw new ApiError(
        500,
        `Failed to stream from Claude AI: ${error.message}`,
      );
    }
  }

  /**
   * Validate response format
   */
  validateResponse(response, expectedSchema) {
    // Basic validation - can be extended with JSON Schema validation
    if (!response) {
      throw new ApiError(500, 'Empty response from Claude AI');
    }

    if (expectedSchema && typeof response === 'object') {
      const missingKeys = expectedSchema.filter(key => !(key in response));
      if (missingKeys.length > 0) {
        console.warn(
          `Response missing expected keys: ${missingKeys.join(', ')}`,
        );
      }
    }

    return true;
  }

  /**
   * Health check for the AI service
   */
  async healthCheck() {
    try {
      if (!this.client) {
        this.initialize();
      }

      await this.sendMessage('Hello, respond with OK', {
        maxTokens: 100,
      });

      return {
        status: 'healthy',
        model: this.model,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const claudeAIService = new ClaudeAIService();
