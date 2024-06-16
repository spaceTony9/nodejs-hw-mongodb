import createHttpError from 'http-errors';

export const validateBody = schema => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (e) {
    const error = createHttpError(400, 'Bad request', { errors: e.details });
    next(error);
  }
};
