import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export default class RentalsControllers {
  async insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    try {
      const gameInfo = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
      const originalPrice = gameInfo.rows[0].pricePerDay * daysRented;
      await db.query(
        `INSERT INTO rentals
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          customerId,
          gameId,
          dayjs(Date.now()).format("YYYY-MM-DD"),
          daysRented,
          null,
          originalPrice,
          null,
        ]
      );
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
