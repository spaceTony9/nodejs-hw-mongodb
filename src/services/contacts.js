import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find({ userId });

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findById({ _id: contactId, userId });
  return contact;
};

export const createContact = async payload => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const patchContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async contactId => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });

  return contact;
};
