import { Router } from "express";
import GamesControllers from "../controllers/games.controllers.js";
import GamesValidation from "../middlewares/games.validation.js";
import { validateSchemaBody } from "../middlewares/schema.validate.js";
import schemas from "../schemas/schemas.js";

const gamesControllers = new GamesControllers();
const gamesValidation = new GamesValidation();

const gamesRouter = Router();

gamesRouter.post(
  "/games",
  validateSchemaBody(schemas.insertGameSchema),
  gamesValidation.validateInsertGame,
  gamesControllers.insertGame
);
gamesRouter.get("/games", gamesControllers.getGames);

export default gamesRouter;
