import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import validatePromptRequest from '../../../shared/validatePromptRequest.js';
import { ClaudeServices } from './dyad.service.js';


const ClaudeAiGetResponse = catchAsync(async (req, res) => {
  const { prompt, userId, sessionId } = await validatePromptRequest(req);

  const result = await ClaudeServices.claudeResponseService(prompt, userId, sessionId )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Response processed successfully.',
    data: result,
  });
});

export const ClaudeAiController = {
  ClaudeAiGetResponse,
};
