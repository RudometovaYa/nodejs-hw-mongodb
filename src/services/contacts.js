import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const filter = {};
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

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const contact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true },
  );
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};
