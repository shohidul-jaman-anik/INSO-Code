import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import validatePromptRequest from '../../../shared/validatePromptRequest.js';
import { ClaudeServices } from './dyad.service.js';

const ClaudeAiGetResponse = catchAsync(async (req, res) => {
  // const sessionId = req.body?.sessionId || randomUUID();
  // const { userId, prompt } = req.body;
  const { prompt, userId, sessionId } = await validatePromptRequest(req);

  const result = await ClaudeServices.claudeResponseService(
    prompt,
    userId,
    sessionId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Response processed successfully.',
    data: result,
  });
});

const LlamaAiGetResponseFromDbByUserId = catchAsync(async (req, res) => {
  const userId = req.user?._id;

  console.log(userId, 'userId from token in controller');
  const responseData =
    await ClaudeServices.getAiResponsesByUserIdService(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Response successfully',
    data: responseData,
  });
});

const LlamaAiGetResponseFromDbBySessionId = catchAsync(async (req, res) => {
  const id = req.params?.sessionId;
  // logger.info(id, 'session');

  const responseData = await ClaudeServices.getAiResponsesBySession(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Response successfully',
    data: responseData,
  });
});

const deleteOneAiSession = catchAsync(async (req, res) => {
  const id = req.params?.objectId;
  const result = await ClaudeServices.deleteOneLlamaAiSession(id);
  // logger.info(result, 'resultttt');
  if (!result.success) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      error: result.message,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: result?.message,
    data: result.message,
  });
});

const deleteAllAiSessions = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  console.log(userId, 'userId from token in controller');
  const result = await ClaudeServices.deleteAllAiSessionsService(userId);
  // logger.info(result, 'resultttt');

  if (!result.success) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      error: result.message,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Delete All Successfully',
    data: result,
  });
});

export const ClaudeAiController = {
  ClaudeAiGetResponse,
  LlamaAiGetResponseFromDbByUserId,
  LlamaAiGetResponseFromDbBySessionId,
  deleteOneAiSession,
  deleteAllAiSessions,
};
