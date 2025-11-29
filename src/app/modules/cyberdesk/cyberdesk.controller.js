import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { cyberdeskService } from './cyberdesk.service.js';

const launch = catchAsync(async (req, res, next) => {
  const result = await cyberdeskService.launchDesktops();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Desktop Launched successfully.',
    data: result,
  });
});

const info = catchAsync(async (req, res, next) => {
  const result = await cyberdeskService.getDesktopInfo(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Desktop Info Processed Successfully.',
    data: result,
  });
});

const click = catchAsync(async (req, res, next) => {
  const { x, y } = req.body;

  const result = await cyberdeskService.clickMouse(req.params.id, x, y);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Desktop Click Processed Successfully.',
    data: result,
  });
});

const bash = catchAsync(async (req, res, next) => {
  const { command } = req.body;

  const result = await cyberdeskService.executeBash(req.params.id, command);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Desktop Bash Processed Successfully.',
    data: result,
  });
});

const terminate = catchAsync(async (req, res, next) => {
  const result = await cyberdeskService.terminateDesktop(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Desktop Terminate Successfully.',
    data: result,
  });
});

export const cyberdeskController = {
  launch,
  info,
  click,
  bash,
  terminate,
};
