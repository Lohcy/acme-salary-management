const errorHandler = (err, req, res, next) => {
  // Default to 500 if the error doesn't have a status code (e.g., standard Node errors)
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'ERR_UNKNOWN';

  // Standardized JSON response
  const errorResponse = {
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected server error occurred.',
    }
  };

  // Only include stack trace in development mode for debugging
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;