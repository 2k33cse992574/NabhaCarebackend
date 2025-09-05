const Joi = require("joi");

module.exports = Joi.object({
  doctorId: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
});
