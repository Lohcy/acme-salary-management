const ERROR_CODES = require('./errorCodes');

class AppError extends Error {
  constructor(errorType, message) {
    super(message);
    this.statusCode = errorType.status || 500;
    this.errorCode = errorType.code || ERROR_CODES.INTERNAL_SERVER.code;
    
    // Flags this as an expected, operational error rather than a random unhandled exception
    this.isOperational = true; 

    // Captures the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;