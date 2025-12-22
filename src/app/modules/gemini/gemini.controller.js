import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
// import { ConversationChain } from 'langchain/chains';
import validatePromptRequest from '../../../shared/validatePromptRequest.js';
import { GeminiAiService } from './gemini.service.js';

const GeminiAiGetResponse = catchAsync(async (req, res) => {
  const { prompt, userId, sessionId, language, errorResponse } =
    await validatePromptRequest(req);
  console.log(language, 'language from gemini controller');
  const result = await GeminiAiService.geminiService(
    sessionId,
    prompt,
    userId,
    language,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Response processed successfully.',
    data: result,
  });
});

export const GeminiAiController = {
  GeminiAiGetResponse,
};
