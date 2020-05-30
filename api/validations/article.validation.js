const Joi = require('joi');

module.exports = {
  articleResource: {
    body: {
      topic: Joi.string().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      public: Joi.boolean().required(),
    },
  },
};
