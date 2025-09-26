import express from 'express';

import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';

import { contactSchema, updateContactSchema } from '../validation/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', isValidID, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  isValidID,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete('/:contactId', isValidID, ctrlWrapper(deleteContactController));

export default router;
