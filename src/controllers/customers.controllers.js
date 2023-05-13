import { db } from "../database/database.connection.js";

export default class CustomerControllers {
  async insertClient(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
      await db.query(
        `
      INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);
      `,
        [name, phone, cpf, birthday]
      );
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async getCustomers(req, res) {
    try {
      const customers = await db.query(`
        SELECT * FROM "customers";
        `);
      res.status(200).send(customers.rows);
    } catch (err) {
      console.log(err.message);
    }
  }

  async getCustomersById(req, res) {
    const { id } = req.params;
    try {
      const customer = await db.query(
        `
      SELECT * FROM customers WHERE customers.id=$1
      `,
        [id]
      );
      res.status(200).send(customer.rows);
    } catch (err) {
      return res.sendStatus(500);
    }
  }

  async updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    try {
      await db.query(
        `
      UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5
      `,
        [name, phone, cpf, birthday, id]
      );
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}