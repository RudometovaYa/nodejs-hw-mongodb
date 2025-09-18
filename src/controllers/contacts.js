import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export async function getAllContactsController(req, res, next) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
}

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }

    const contact = await getContactById(contactId);

    if (contact === null) {
      throw createHttpError.NotFound('Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

export async function createContactController(req, res, next) {
  try {
    const contact = await createContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateContactController(req, res, next) {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }

    const contact = await updateContact(contactId, req.body);

    if (contact === null) {
      throw new createHttpError.NotFound('Contact not found');
    }
    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteContactController(req, res, next) {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      throw createHttpError(404, 'Contact not found');
    }

    const contact = await deleteContact(contactId);

    if (contact === null) {
      throw createHttpError(404, 'Contact not found');
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
