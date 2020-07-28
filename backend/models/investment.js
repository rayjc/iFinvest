const db = require("../db");
const ExpressError = require("../helpers/expressError");


class Investment {
  constructor(id, initial_value, initial_price, symbol, portfolio_id, start_date = null, end_date = null) {
    this.id = id;
    this.initial_value = initial_value;
    this.initial_price = initial_price;
    this.symbol = symbol;
    this.portfolio_id = portfolio_id;
    this.start_date = start_date;
    this.end_date = end_date;
  }

  /**
   * Get investment by id; returns an Investment instance.
   * @param {Number} investmentId 
   */
  static async get(investmentId) {
    const result = await db.query(
      `SELECT id, initial_value, initial_price, symbol, portfolio_id, start_date, end_date FROM investments
        WHERE id = $1`,
      [investmentId]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Cannot find investment_id:${investmentId}`, 404);
    }

    const row = result.rows[0];
    return new Investment(...Object.values(row));
  }

  /**
   * Creates/writes an investment; returns the created Investment instance.
   * @param {Number} initialValue 
   * @param {String} symbol 
   * @param {Number} portfolioId 
   * @param {String} startDate 
   * @param {String} endDate 
   */
  static async create(initialValue, symbol, portfolioId, startDate = null, endDate = null) {
    try {
      const result = startDate ?
        await db.query(
          `INSERT INTO investments (initial_value, symbol, portfolio_id, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, initial_value, initial_price, symbol, portfolio_id, start_date, end_date`,
          [initialValue, symbol, portfolioId, startDate, endDate]
        ) :
        await db.query(
          `INSERT INTO investments (initial_value, symbol, portfolio_id, end_date)
            VALUES ($1, $2, $3, $4)
            RETURNING id, initial_value, initial_price, symbol, portfolio_id, start_date, end_date`,
          [initialValue, symbol, portfolioId, endDate]
        );

      const row = result.rows[0];
      return new Investment(...Object.values(row));

    } catch (error) {
      if (error.code === "23503") {
        throw new ExpressError(`Invalid symbol, ${this.symbol}.`, 403);
      } else if (error.code === "23505") {
        throw new ExpressError(error.detail, 403);
      }
      throw error;
    }
  }

  /**
   * Update investment in database based on current instance; 
   * returns updated instance.
   */
  async update() {
    try {
      const result = await db.query(
        `UPDATE investments SET initial_value=$2, symbol=$3, start_date=$4, end_date=$5
          WHERE id=$1
          RETURNING id, initial_value, initial_price, symbol, portfolio_id, start_date, end_date`,
        [this.id, this.initial_value, this.symbol, this.start_date, this.end_date]
      );

      if (result.rows.length === 0) {
        throw new ExpressError(`Cannot find investment_id:${this.id}`, 404);
      }

      return new Investment(...Object.values(result.rows[0]));

    } catch (error) {
      if (error.code === "23503") {
        throw new ExpressError(`Invalid symbol, ${this.symbol}.`, 403);
      } else if (error.code === "23505") {
        throw new ExpressError(error.detail, 403);
      }
      throw error;
    }
  }

  /**
   * Deletes current instance from database.
   */
  async remove() {
    const result = await db.query(
      `DELETE FROM investments WHERE id=$1 RETURNING *`,
      [this.id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Cannot find investment_id:${this.id}`, 404);
    }
  }
}


module.exports = Investment;