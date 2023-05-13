import Joi from "joi";

const schemas = {
  insertGameSchema: Joi.object({
    name: Joi.string().min(1).required(),
    stockTotal: Joi.number().min(1).required(),
    pricePerDay: Joi.number().min(1).required(),
  }).unknown(true),
};

export default schemas;
