const Joi = require('joi')

const authenticateBodySchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});

const headerSchema = Joi.object({
  'x-access-token': Joi.string().required()
});

const bookBodySchema = Joi.object({
  pickupLocation: Joi.required(),
  dropLocation: Joi.required()
});

const completeBodySchema = Joi.object({
  cabId: Joi.string().required(),
  bookingId: Joi.string().required()
});

module.exports = {
  authenticateBodySchema: authenticateBodySchema,
  headerSchema: headerSchema,
  bookBodySchema: bookBodySchema,
  completeBodySchema: completeBodySchema
};