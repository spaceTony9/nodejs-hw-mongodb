import { model } from 'mongoose';
import { contactsSchema } from '../contact.js';

export const ContactsCollection = model('contacts', contactsSchema);
