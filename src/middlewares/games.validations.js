import { db } from "../database/database.connection.js";

export default class GamesValidation {
  async validateInsertGame(req, res, next) {
    const { name } = req.body.name;
    try {
      const game = await db.query(
        `
      SELECT * FROM games WHERE games.name=$1
      `,
        [name]
      );
      if (game.rows.length > 0) return res.sendStatus(409);
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
