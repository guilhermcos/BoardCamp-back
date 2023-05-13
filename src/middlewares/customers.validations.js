import { db } from "../database/database.connection.js";

export default class CustomersValidations {
  async validateInsertClient(req, res, next) {
    const { cpf } = req.body;
    try {
      const customer = await db.query(
        `
      SELECT * FROM customers WHERE customers.cpf=$1;
      `,
        [cpf]
      );
      if (customer.rows.length > 0) return res.sendStatus(409);
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async validateGetCustomersById(req, res, next) {
    const { id } = req.params;
    try {
      const customer = await db.query(
        `
      SELECT * FROM customers WHERE customers.id=$1
      `,
        [id]
      );
      if (customer.rows.length === 0) return res.sendStatus(404);
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async validateUpdateCustomersById(req, res, next) {
    const { id } = req.params;
    const { cpf } = req.body;
    try {
      const [customerById, customerByCpf] = await Promise.all([
        db.query(`SELECT * FROM customers WHERE id=$1`, [id]),
        db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]),
      ]);
      if (customerById.rows.length < 1) return res.sendStatus(404);
      console.log(customerByCpf.rows);
      console.log(customerById.rows);
      if (
        customerByCpf.rows.length > 0 &&
        customerByCpf.rows[0].cpf !== customerById.rows[0].cpf
      ) {
        return res.sendStatus(409);
      }
      next();
    } catch (err) {
      res.sendStatus(500);
    }
  }
}
