const Joi = require('joi');

module.exports = {
  login: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
  register: {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
  userUpdate: {
    body: {
      approved: Joi.boolean().required(),
      role: Joi.string().required(),
    },
  },
};
