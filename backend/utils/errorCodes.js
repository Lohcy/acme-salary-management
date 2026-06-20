const ERROR_CODES = {
  VALIDATION_ERROR: {
    status: 400,
    code: 'ERR_VALIDATION_FAILED'
  },
  DATABASE_ERROR: {
    status: 500,
    code: 'ERR_DATABASE_OPERATION'
  },
  RESOURCE_NOT_FOUND: {
    status: 404,
    code: 'ERR_RESOURCE_NOT_FOUND'
  },
  INTERNAL_SERVER: {
    status: 500,
    code: 'ERR_INTERNAL_SERVER'
  }
};

module.exports = ERROR_CODES;