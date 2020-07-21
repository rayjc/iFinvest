const axios = require('axios');
const db = require('../db');
const { IEX_TOKEN } = require('../config');

async function initDb() {
  const token = IEX_TOKEN;
  if (!token) {
    throw Error('Environment variable IEX token is not set');
  }

  try {
    // fetch all available symbols from api
    const res = await axios.get(
      // "https://cloud.iexapis.com/stable/ref-data/symbols", { params: token }
      "https://sandbox.iexapis.com/stable/ref-data/symbols", { params: { token } }
    );

    // remove rows in stocks table
    await db.query('DELETE FROM stocks');
    console.log('Removed old stock symbols.');

    // populate stocks table
    for (let { symbol, name, exchange, date, region, currency, type } of res.data) {
      await db.query(
        `INSERT INTO stocks (symbol, name, exchange, ipo_date, region, currency, type)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [symbol, name, exchange, date, region, currency, type]);
    }
    console.log(`Database initialized with stock symbols.`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = initDb;