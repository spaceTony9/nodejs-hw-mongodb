import { model } from 'mongoose';
import { sessionSchema } from '../session.js';

export const SessionCollection = model('session', sessionSchema);
