import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  registerUserController,
  loginUserController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';

import { registerSchema, loginSchema } from '../validation/auth.js';

import { refreshUserSessionController } from '../controllers/auth.js';

import { logoutUserController } from '../controllers/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
