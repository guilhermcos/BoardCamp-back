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
    const { customerId = "", gameId = "" } = req.query;
    try {
      const rentals = await db.query(
        `SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName" FROM rentals
        JOIN games ON rentals."gameId" = games."id"
        JOIN customers ON rentals."customerId" = customers."id" 
        WHERE 1=1 
        ${customerId ? `AND "customerId" = $1` : `AND $1 = $1`} 
        ${gameId ? `AND "gameId" = $2` : `AND $2 = $2`}
        ;`,
        [customerId, gameId]
      );
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
        const formatedReturnDate = returnDate ? dayjs(rentDate).format("YYYY-MM-DD") : null;
        return {
          id,
          customerId,
          gameId,
          rentDate: formatedrentDate,
          daysRented,
          returnDate: formatedReturnDate,
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
      res.status(500).send(err.message);
    }
  }

  async deleteRental(req, res) {
    const { id } = req.params;
    try {
      await db.query(`DELETE FROM rentals WHERE rentals."id" = $1`, [id]);
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async finishRental(req, res) {
    const { id } = req.params;
    try {
      const rental = res.locals.rental;
      const { daysRented, originalPrice } = rental;

      const today = Date.now();
      const rentDate = rental.rentDate;
      const daysWithCustomer = dayjs(today).diff(rentDate, "day");
      const returnDate = dayjs(today).format("YYYY-MM-DD");

      let delayFee = 0;
      if (daysWithCustomer > daysRented) {
        delayFee = (daysWithCustomer - daysRented) * (originalPrice / daysRented);
      }

      await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [
        returnDate,
        delayFee,
        id,
      ]);

      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
