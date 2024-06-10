export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: res.status,
    message: 'Route not found',
  });
};
