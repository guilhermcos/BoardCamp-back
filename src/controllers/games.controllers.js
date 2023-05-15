import { db } from "../database/database.connection.js";

export default class GamesControllers {
  async insertGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
      await db.query(
        `
        INSERT INTO "games" 
        ("name", "image", "stockTotal", "pricePerDay") 
        VALUES ($1,$2,$3,$4);
        `,
        [name, image, stockTotal, pricePerDay]
      );
      return res.sendStatus(201);
    } catch (err) {
      console.log(err.message);
    }
  }

  async getGames(req, res) {
    const { name = "" } = req.query;
    try {
      const games = await db.query(
        `
        SELECT * FROM "games" WHERE name ILIKE $1 || '%';
        `,
        [name]
      );
      res.status(200).send(games.rows);
    } catch (err) {
      console.log(err.message);
    }
  }
}
