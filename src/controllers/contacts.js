import createHttpError from 'http-errors';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
} from '../services/contacts.js';
import {
  parseFilterParams,
  parsePaginationParams,
  parseSortParams,
} from '../utils/parinationParamsParser.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (req.user._id.toString() !== contact.userId.toString())
    throw createHttpError(401, 'Unauthorised');

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: res.statusCode,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const combinedPayload = { ...req.body, userId: req.user._id };

  const contact = await createContact(combinedPayload);

  res.status(201).json({
    status: res.statusCode,
    message: 'Successfully created a contact!',
    data: { contact },
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (req.user._id.toString() !== contact.userId.toString())
    throw createHttpError(401, 'Unauthorised');

  const result = await patchContact(contactId, req.body);
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contactData = await getContactById(contactId);

  if (req.user._id.toString() !== contactData.userId.toString())
    throw createHttpError(401, 'Unauthorised');

  const contact = await deleteContact(contactId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
