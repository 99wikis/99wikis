const Joi = require('@hapi/joi');
const { DefaultException } = require('../exceptions/index');

class Validator {
  static validate(data, schema, errorContextCode) {
    const config = {
      abortEarly: false,
      allowUnknown: true,
    };

    const result = Joi.validate(data, schema, config);

    if (result.error) {
      const errors = [];
      result.error.details.forEach((error) => errors.push(error.message));

      throw new DefaultException(errorContextCode, errors, 400);
    }

    return (typeof data === 'object') ? { ...data, ...result.value } : result.value;
  }
}

module.exports = Validator;
