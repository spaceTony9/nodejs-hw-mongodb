import { model } from 'mongoose';
import { userSchema } from '../user.js';

export const UserCollection = model('users', userSchema);
