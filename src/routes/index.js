import express from 'express';

import authRoutes from './auth.js';
import contactsRoutes from './contacts.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contacts', contactsRoutes);

export default router;
