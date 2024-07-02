import { UserCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import { SessionCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export const registerUser = async payload => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const registeredUser = await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
  return registeredUser;
};

export const loginUser = async payload => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found!');

  const isEqual = await bcrypt.compare(payload.password, user.password);

  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  if (!isEqual) throw createHttpError(401, 'Unauthorised!');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionExpired) throw createHttpError(401, 'Session token Expired');

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async sessionId => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
