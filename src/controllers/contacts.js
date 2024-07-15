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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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

  const { data, totalItems, totalPages, hasNextPage, hasPreviousPage } =
    contacts;

  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully found contacts!',
    data: data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  });
};

export const getContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  if (req.user._id.toString() !== contact.userId.toString())
    throw createHttpError(401, 'Unauthorised');

  res.status(200).json({
    status: res.statusCode,
    message: `Successfully found contact with id ${contactId}!`,
    data: { ...contact },
  });
};

export const createContactController = async (req, res) => {
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const combinedPayload = {
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  };

  const contact = await createContact(combinedPayload);

  res.status(201).json({
    status: res.statusCode,
    message: 'Successfully created a contact!',
    data: { ...contact },
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  if (req.user._id.toString() !== contact.userId.toString())
    throw createHttpError(401, 'Unauthorised');

  const result = await patchContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: { ...result._doc },
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contactData = await getContactById(contactId);

  if (!contactData) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  if (req.user._id.toString() !== contactData.userId.toString())
    throw createHttpError(401, 'Unauthorised');

  const contact = await deleteContact(contactId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
