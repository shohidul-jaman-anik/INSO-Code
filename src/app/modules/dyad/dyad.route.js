import express from 'express';
import { ENUM_USER_ROLE } from '../../../shared/enum.js';
import auth from '../../middlewares/auth/auth.js';
import { ClaudeAiController } from './dyad.controller.js';

const router = express.Router();

router.post(
  '/get-response',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ClaudeAiController.ClaudeAiGetResponse,
);

router.get(
  '/get-response-from-db',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ClaudeAiController.LlamaAiGetResponseFromDbByUserId,
);

router.get(
  '/get-response-by-sessionid/:sessionId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ClaudeAiController.LlamaAiGetResponseFromDbBySessionId,
);

router.delete(
  '/delete-single-response/:objectId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ClaudeAiController.deleteOneAiSession,
);

router.delete(
  '/delete-all-response-from-db',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ClaudeAiController.deleteAllAiSessions,
);

export const dyadAiRoutes = router;
