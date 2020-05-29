const Joi = require('joi');

module.exports = {
  articleResource: {
    body: {
      id: Joi.string(),
      topic: Joi.string().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      public: Joi.boolean().required(),
      createdBy: Joi.string().required(),
      createdByName: Joi.string().required(),
      lastModifiedBy: Joi.string(),
      lastModifiedByName: Joi.string(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
    },
  },
};
