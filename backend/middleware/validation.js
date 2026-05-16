const Joi = require('joi');

/**
 * Middleware to validate request data using Joi
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages,
      });
    }

    req[source] = value;
    next();
  };
};

module.exports = { validateRequest };
