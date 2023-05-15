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

  async getRentals(req, res) {
    try {
      const rentals =
        await db.query(`SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName" FROM rentals
        JOIN games ON rentals."gameId" = games."id"
        JOIN customers ON rentals."customerId" = customers."id"`);
      const rentalsList = rentals.rows.map((rental) => {
        const {
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
          gameName,
          customerName,
        } = rental;
        const formatedrentDate = dayjs(rentDate).format("YYYY-MM-DD");
        return {
          id,
          customerId,
          gameId,
          formatedrentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
          customer: {
            id: customerId,
            name: customerName,
          },
          game: {
            id: gameId,
            name: gameName,
          },
        };
      });
      res.status(200).send(rentalsList);
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
