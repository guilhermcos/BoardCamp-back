import schemas from "../schemas/schemas.js";
import CustomersValidations from "../middlewares/customers.validations.js";
import CustomerControllers from "../controllers/customers.controllers.js";
import { Router } from "express";
import { validateSchemaBody } from "../middlewares/schema.validate.js";

const customersControllers = new CustomerControllers();
const customersValidations = new CustomersValidations();

const customersRouter = Router();

customersRouter.post(
  "/customers",
  validateSchemaBody(schemas.insertClientSchema),
  customersValidations.validateInsertClient,
  customersControllers.insertClient
);
customersRouter.get("/customers", customersControllers.getCustomers);
customersRouter.get(
  "/customers/:id",
  customersValidations.validateGetCustomersById,
  customersControllers.getCustomersById
);
customersRouter.put(
  "/customers/:id",
  validateSchemaBody(schemas.insertClientSchema),
  customersValidations.validateUpdateCustomersById,
  customersControllers.updateCustomer
);
export default customersRouter;
