import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';

export async function getAllContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { type, isFavourite } = parseFilterParams(req.query);

  const {
    data: contacts,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
}

export async function getContactByIdController(req, res, next) {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(404, 'Contact not found');
  }

  const contact = await getContactById(req.user._id, contactId);

  if (contact === null) {
    throw createHttpError.NotFound('Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res, next) {
  let photo;

  if (getEnvVar('UPLOAD_CLOUDINARY') === 'true') {
    const response = await saveFileToCloudinary(req.file.path);
    await fs.unlink(req.file.path);
    photo = response.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src/uploads/photo', req.file.filename),
    );
    photo = `http://localhost:3000/photo/${req.file.filename}`;
  }

  const contact = await createContact(req.user._id, { ...req.body, photo });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res, next) {
  const { contactId } = req.params;

  // Перевірка на валідність ObjectId
  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(404, 'Contact not found');
  }

  let photo;

  // Якщо завантажено файл
  if (req.file) {
    if (getEnvVar('UPLOAD_CLOUDINARY') === 'true') {
      const response = await saveFileToCloudinary(req.file.path);
      await fs.unlink(req.file.path); // Видалити тимчасовий файл після завантаження
      photo = response.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src/uploads/photo', req.file.filename),
      );
      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }

  // Якщо є фото — додаємо до даних, інакше лише body
  const updatedData = photo ? { ...req.body, photo } : req.body;

  // Оновлення контакту
  const contact = await updateContact(req.user._id, contactId, updatedData);

  if (contact === null) {
    throw createHttpError(404, 'Contact not found');
  }

  // Відповідь при успішному оновленні
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export async function deleteContactController(req, res, next) {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createHttpError(404, 'Contact not found');
  }

  const contact = await deleteContact(req.user._id, contactId);

  if (contact === null) {
    throw createHttpError(404, 'Contact not found');
  }
  res.sendStatus(204);
}
