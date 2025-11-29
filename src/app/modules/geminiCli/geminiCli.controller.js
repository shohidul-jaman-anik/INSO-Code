import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { GeminiCliService } from './geminiCli.service.js';

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { prompt } = req.body;
  const result = await GeminiCliService.runGeminiCLI(prompt);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Response processed successfully.',
    data: result,
  });
});

export const GeminiCliController = {
  createCheckoutSession,
};
