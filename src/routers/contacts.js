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
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactsByIdController));

router.post(
  '',
  validateBody(postContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:contactId',
  validateBody(updateStudentSchema),
  isValidId,
  ctrlWrapper(patchContactController)
);

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
