const AppError = require('../utils/AppError');
const ERROR_CODES = require('../utils/errorCodes');

const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  // Validate 'page' if provided
  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return next(new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid pagination: page must be a positive integer.'));
    }
  }

  // Validate 'limit' if provided (Strictly cap it to prevent memory overload)
  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return next(new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid pagination: limit must be between 1 and 100.'));
    }
  }

  next(); // Inputs are safe, proceed to the controller
};

module.exports = { validatePagination };