const Joi = require("joi");

const createUserSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("SALES_USER").required(),
  companyId: Joi.string().required()
});

module.exports = {
  createUserSchema
};