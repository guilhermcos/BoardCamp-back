import { Router } from "express";
import RentalsControllers from "../controllers/rentals.controllers.js";
import RentalsValidations from "../middlewares/rentals.validations.js";
import schemas from "../schemas/schemas.js";
import { validateSchemaBody } from "../middlewares/schema.validate.js";

const rentalsControllers = new RentalsControllers();
const rentalsValidations = new RentalsValidations();

const rentalsRouter = Router();

rentalsRouter.get("/rentals", rentalsControllers.getRentals);
rentalsRouter.post(
  "/rentals",
  validateSchemaBody(schemas.insertRental),
  rentalsValidations.validateInsertRental,
  rentalsControllers.insertRental
);
rentalsRouter.post(
  "/rentals/:id/return",
  rentalsValidations.validateFinishRental,
  rentalsControllers.finishRental
);
rentalsRouter.delete(
  "/rentals/:id",
  rentalsValidations.validateDeleteRental,
  rentalsControllers.deleteRental
);

export default rentalsRouter;
