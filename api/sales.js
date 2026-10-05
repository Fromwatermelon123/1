import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { ca: process.env.DB_CA },
      dateStrings: true,
      connectTimeout: 10000,
    });
    const [rows] = await conn.query(
      'SELECT sale_id,sale_date,product_id,product_name,category,channel,unit_price,quantity,returned_quantity FROM sales ORDER BY sale_id'
    );
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ error: 'db_error' });
  } finally {
    if (conn) await conn.end();
  }
}
