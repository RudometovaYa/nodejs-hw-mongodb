import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  userId,
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const filter = { userId };

  if (type) filter.contactType = type;
  if (typeof isFavourite === 'boolean') filter.isFavourite = isFavourite;

  const contactQuery = ContactsCollection.find(filter);

  const [contacts, totalItems] = await Promise.all([
    contactQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
    ContactsCollection.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    data: contacts,
    totalItems,
    page,
    perPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const getContactById = async (userId, contactId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (userId, payload) => {
  const contact = await ContactsCollection.create({ ...payload, userId });
  return contact;
};

export const updateContact = async (userId, contactId, payload) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return contact;
};

export const deleteContact = async (userId, contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
