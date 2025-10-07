import express from 'express';
import { ClaudeAiController } from './dyad.controller.js';
import { ENUM_USER_ROLE } from '../../../shared/enum.js';
import auth from '../../middlewares/auth/auth.js';

const router = express.Router();

router.post(
  '/get-response',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ClaudeAiController.ClaudeAiGetResponse,
);

export const dyadAiRoutes = router;
