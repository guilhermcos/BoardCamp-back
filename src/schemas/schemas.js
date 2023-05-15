import Joi from "joi";

const schemas = {
  insertGameSchema: Joi.object({
    name: Joi.string().min(1).required(),
    stockTotal: Joi.number().min(1).required(),
    pricePerDay: Joi.number().min(1).required(),
  }).unknown(true),

  insertClientSchema: Joi.object({
    name: Joi.string().min(1).required(),
    phone: Joi.string()
      .pattern(/^[0-9]+$/, { name: "numbers" })
      .min(10)
      .max(11)
      .required(),
    cpf: Joi.string()
      .pattern(/^[0-9]+$/, { name: "numbers" })
      .min(11)
      .max(11)
      .required(),
    birthday: Joi.string()
      .pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/, {
        name: "date yyyy/mm/dd",
      })
      .required(),
  }).unknown(true),

  insertRental: Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.number().min(1).required(),
  }).unknown(true),
};

export default schemas;
