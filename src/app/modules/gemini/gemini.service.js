// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';
// import { AIMessage, HumanMessage } from '@langchain/core/messages';
// import httpStatus from 'http-status';
// import { BufferMemory } from 'langchain/memory';
// import config from '../../../../config/index.js';
// import ApiError from '../../../errors/ApiError.js';
// import { logger } from '../../../shared/logger.js';
// import UserModel from '../auth/auth.model.js';
// import { paymentController } from '../payment/payment.controller.js';
// // import { GEMINI_RESPONSE_SERVICE_POST } from './gemini.constant.js';
// // import { RedisClient } from '../../../shared/redis.js';
// import Llama from '../dyad/dyad.model.js';

// const client = new GoogleGenerativeAI(config.gemini_secret_key);
// const model = client.getGenerativeModel({ model: 'gemini-3-pro-preview' });

// const sessionMemoryStore = {};

// const geminiService = async (sessionId, prompt, userId, language) => {
//   let memory = sessionMemoryStore[sessionId];
//   if (!memory) {
//     memory = new BufferMemory({
//       returnMessages: true,
//       memoryKey: 'history',
//       chatHistory: new InMemoryChatMessageHistory(),
//     });
//     sessionMemoryStore[sessionId] = memory;
//   }

//   try {
//     await memory.chatHistory.addMessage(new HumanMessage(prompt));

//     // Call Gemini AI to generate a response
//     const result = await model.generateContent(prompt);
//     const reply =
//       result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       'No reply generated';

//     try {
//       const paymentResult =
//         await paymentController.incrementPromptsUsed(userId);

//       if (!paymentResult.success) {
//         throw new ApiError(httpStatus.BAD_REQUEST, paymentResult.message);
//       }
//     } catch (error) {
//       logger.error('Error in incrementPromptsUsed:', error);
//       throw new ApiError(
//         httpStatus.INTERNAL_SERVER_ERROR,
//         error.message || 'An error occurred while updating prompt usage.',
//       );
//     }

//     await memory.chatHistory.addMessage(new AIMessage(reply));

//     const responseData = {
//       prompt,
//       model: 'gemini-1.5-flash',
//       reply,
//       total_time: result?.usage?.total_time || 0,
//     };

//     let geminiSession = await Llama.findOne({ user: userId, sessionId });

//     if (geminiSession) {
//       geminiSession.responses.push(responseData);
//       await geminiSession.save();
//     } else {
//       geminiSession = await Llama.create({
//         user: userId,
//         sessionId,
//         responses: [responseData],
//       });
//       await UserModel.findByIdAndUpdate(userId, {
//         $push: { llamaAiSessions: geminiSession._id },
//       });
//     }

//     const payload = { prompt, sessionId, reply };
//     // if (payload) {
//     //   await RedisClient.publish(
//     //     GEMINI_RESPONSE_SERVICE_POST,
//     //     JSON.stringify(payload),
//     //   );
//     // }
//     return payload;
//   } catch (err) {
//     logger.error('Gemini Service Error:', err);
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       'Gemini Service failed',
//     );
//   }
// };

// export const GeminiAiService = {
//   geminiService,
// };

import { GoogleGenerativeAI } from '@google/generative-ai';
import httpStatus from 'http-status';
import config from '../../../../config/index.js';
import ApiError from '../../../errors/ApiError.js';
import { logger } from '../../../shared/logger.js';
import Llama from '../dyad/dyad.model.js';
import UserModel from '../auth/auth.model.js';

const client = new GoogleGenerativeAI(config.gemini_secret_key);
const sessionStore = {};

// ---------- Service ----------

const geminiService = async (sessionId, prompt, userId, language = 'text') => {
  try {
    const coding = /code|api|script|debug/i.test(prompt);

    if (!sessionStore[sessionId]) {
      sessionStore[sessionId] = [];
    }

    // UPDATED MODEL NAME: gemini-3-pro-preview
    const model = client.getGenerativeModel({
      model: 'gemini-3-pro-preview',
    });

    const chat = model.startChat({
      history: sessionStore[sessionId],
      generationConfig: {
        maxOutputTokens: 65536, // Gemini 3 supports much larger output limits
        temperature: coding ? 0.2 : 0.7,
        // Optional: thinkingLevel is a new Gemini 3 feature for reasoning
        // thinkingLevel: coding ? 'high' : 'low',
      },
    });

    const startTime = performance.now();
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    const totalTimeMs = Math.round(performance.now() - startTime);

    // Update Local History
    sessionStore[sessionId].push(
      { role: 'user', parts: [{ text: prompt }] },
      { role: 'model', parts: [{ text: responseText }] },
    );

    const responseData = {
      prompt,
      language,
      model: 'gemini-3-pro-preview',
      reply: responseText,
      total_time: totalTimeMs,
      createdAt: new Date(),
    };

    let session = await Llama.findOne({ sessionId });
    if (!session) {
      session = await Llama.create({
        user: userId,
        sessionId,
        responses: [responseData],
      });
      await UserModel.findByIdAndUpdate(userId, {
        $push: { llamaAiSessions: session._id },
      });
    } else {
      session.responses.push(responseData);
      await session.save();
    }

    return {
      sessionId,
      reply: responseText,
      model: 'gemini-3-pro-preview',
      total_time: totalTimeMs,
    };
  } catch (err) {
    logger.error('Gemini Service Error:', err);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const GeminiAiService = { geminiService };
