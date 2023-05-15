import { db } from "../database/database.connection.js";

export default class RentalsValidations {
  async validateInsertRental(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;
    try {
      const [customer, game, rentals] = await Promise.all([
        db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]),
        db.query(`SELECT * FROM games WHERE id = $1`, [gameId]),
        db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`, [gameId]),
      ]);
      if (!customer.rows.length) return res.status(400).send("customer does not exist");
      if (!game.rows.length) return res.status(400).send("game does not exist");
      if (rentals.rows.length >= game.rows[0].stockTotal) {
        return res.status(400).send("game out of stock at the moment");
      }
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async validateDeleteRental(req, res, next) {
    const { id } = req.params;
    try {
      const rental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
      if (!rental.rows.length) return res.status(404).send("rental not found");
      if (rental.rows[0].returnDate === null) return res.status(400).send("rental not finished");
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async validateFinishRental(req, res, next) {
    const { id } = req.params;
    try {
      const rental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
      if (!rental.rows.length) return res.status(404).send("rental not found");
      if (rental.rows[0].returnDate !== null) return res.status(400).send("already finished");
      res.locals.rental = rental.rows[0];
      next();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
