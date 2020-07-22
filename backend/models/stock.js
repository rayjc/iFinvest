const db = require("../db");
const ExpressError = require("../helpers/expressError");


class Stock {
  constructor(symbol, name, exchange, ipo_date, region, currency, type) {
    this.symbol = symbol;
    this.name = name;
    this.exchange = exchange;
    this.ipo_date = ipo_date;
    this.region = region;
    this.currency = currency;
    this.type = type;
  }

  static async getAll(verbose = false) {
    const result = verbose ?
      await db.query(
        `SELECT symbol, name, exchange, ipo_date, region, currency, type
          FROM stocks ORDER BY symbol`
      ) :
      await db.query(
        `SELECT symbol, name, exchange
          FROM stocks ORDER BY symbol`
      );

    return result.rows.map(r => new Stock(...Object.values(r)));
  }

  static async findAll(symbol) {
    const result = await db.query(
      `SELECT symbol, name, exchange FROM stocks
        WHERE symbol ILIKE $1`,
      [`%${symbol}%`]
    );

    return result.rows.map(r => new Stock(...Object.values(r)));
  }
}


module.exports = Stock;