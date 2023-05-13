import { db } from "../database/database.connection.js";

export default class GamesValidation {
  async validateInsertGame(req, res, next) {
    try {
      const game = db.query(
        `
      SELECT * FROM games WHERE games.name=$1
      `,
        [req.body.name]
      );
      if ((await game).rows.length > 0) return res.sendStatus(409);
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
