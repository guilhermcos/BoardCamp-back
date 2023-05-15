import { Router } from "express";
import RentalsControllers from "../controllers/rentals.controllers.js";
import RentalsValidations from "../middlewares/rentals.validations.js";
import schemas from "../schemas/schemas.js";
import { validateSchemaBody } from "../middlewares/schema.validate.js";

const rentalsControllers = new RentalsControllers();
const rentalsValidations = new RentalsValidations();

const rentalsRouter = Router();

rentalsRouter.post(
  "/rentals",
  validateSchemaBody(schemas.insertRental),
  rentalsValidations.validateInsertRental,
  rentalsControllers.insertRental
);
rentalsRouter.get("/rentals", rentalsControllers.getRentals);

export default rentalsRouter;
