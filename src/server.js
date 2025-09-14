import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config(); /* завантажуємо змінну */

export const setupServer = () => {
  const app = express();
  app.use(express.json());

  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      /* Якщо ID не валідний — одразу 404 */
      return res.status(404).json({ message: 'Contact not found' });
    }

    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  /*  Миделварка, маршрут для неіснуючих сторінок.  */
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = Number(process.env.PORT) || 3000;

  /*  Запуск сервера  */
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
