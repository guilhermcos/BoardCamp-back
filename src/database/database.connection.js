import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

export const db = new Pool(configDatabase);

/* export async function buscarReceitas(req, res) {
  try {
    const receitas = await db.query("SELECT * FROM receitas");
    res.send(receitas.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
} */

/* export async function buscarReceitaPorId(req, res) {
  const { id } = req.params;
  try {
    const receita = await db.query(`SELECT * FROM receitas WHERE id = $1;`, [id]);
    res.send(receita.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
} */
