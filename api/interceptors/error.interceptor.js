const config = require('../infrastructure/config');
const responseFactory = require('../factories/response.factory');
const exceptions = require('../exceptions');
const errorCodes = require('../enums/error-codes.enum');
//

const errorInterceptor = (err, req, res, next) => {
  if (!err) return next();

  // If it is a validation error, return specific message
  if (typeof err === 'string') {
    return res.status(400).json(responseFactory.fail(errorCodes.VALIDATION_ERROR, err));
  }

  if (err.messages && err.messages === 'validation error') {
    return res.status(400).json(responseFactory.fail(errorCodes.VALIDATION_ERROR, err.messages));
  }

  if (err instanceof exceptions.DefaultException) {
    const httpCode = err.httpCode || 500;
    console.error('Known Error: ', err);
    return res.status(httpCode).json(responseFactory.fail(err.code, err.messages));
  }

  console.error('Unknown Error: ', err);
  if ((err.messages || err.message) && (config.env === 'local' || config.env === 'dev')) {
    return res.status(500).json(responseFactory.fail(errorCodes.UNEXPECTED, err.messages || err.message));
  }

  return res.status(500).json(responseFactory.fail(errorCodes.UNEXPECTED, 'Ops. One unexpected error just happened. Please report this to us.'));
};

module.exports = errorInterceptor;
