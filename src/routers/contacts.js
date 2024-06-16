import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactsByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  postContactSchema,
  updateStudentSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactsByIdController));

router.post(
  '/contacts',
  validateBody(postContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/contacts/:contactId',
  validateBody(updateStudentSchema),
  isValidId,
  ctrlWrapper(patchContactController)
);

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
