const db = require("../db");
const ExpressError = require("../helpers/expressError");


class Portfolio {
  constructor(id, name, user_id, created_at = undefined, investments = []) {
    this.id = id;
    this.name = name;
    this.user_id = user_id;
    this.created_at = created_at;
    this.investments = investments;
  }

  /**
   * Get portfolio by id; returns an portfolio instance,
   * { id, name, user_id, created_at, investments: [{investment_id, symbol}, ...] }.
   * @param {Number} portfolioId 
   */
  static async get(portfolioId, verbose = false) {
    const portfolioResult = await db.query(
      `SELECT id, name, user_id, created_at FROM portfolios
        WHERE id = $1`,
      [portfolioId]
    );

    if (portfolioResult.rows.length === 0) {
      throw new ExpressError(`Cannot find portfolio_id:${portfolioId}`, 404);
    }

    const investmentsResult = verbose
      ? await db.query(
        `SELECT id, symbol, initial_value, initial_price, start_date, end_date FROM investments
          WHERE portfolio_id = $1`,
        [portfolioId]
      )
      : await db.query(
        `SELECT id, symbol FROM investments
        WHERE portfolio_id = $1`,
        [portfolioId]
      );

    const portfolio = portfolioResult.rows[0];
    portfolio.investments = investmentsResult.rows;

    return new Portfolio(...Object.values(portfolio));
  }

  /**
   * Get portfolios by userId; returns an array of portfolios.
   * [{ id, name, user_id, created_at, investments: [{investment_id, symbol}, ...] }, ].
   * @param {Number} userId 
   */
  static async getPortfolios(userId) {
    const result = await db.query(
      `SELECT portfolios.id, name, user_id, created_at, COALESCE(
          JSON_AGG(json_build_object('id', investments.id, 'symbol', investments.symbol))
          FILTER (WHERE investments.portfolio_id IS NOT NULL), '[]'
        ) AS investments
        FROM portfolios
        LEFT JOIN investments ON investments.portfolio_id=portfolios.id
        WHERE user_id=$1
        GROUP BY portfolios.id`,
      [userId]
    );

    return result.rows.map(r => new Portfolio(...Object.values(r)));
    // const results = await db.query(
    //   `SELECT id, name, user_id, created_at FROM portfolios
    //     WHERE user_id=$1`,
    //   [userId]
    // );

    // const promises = results.rows.map(async r => {
    //   const investmentsResult = await db.query(
    //     `SELECT id, symbol FROM investments
    //     WHERE portfolio_id = $1`,
    //     [r.id]
    //   );

    //   r.investments = investmentsResult.rows;
    //   return new Portfolio(...Object.values(r));
    // });
    // return await Promise.all(promises);
  }

  /**
   * Creates/writes an portfolio; returns the created portfolio instance.
   * @param {String} name 
   * @param {Number} userId 
   */
  static async create(name, userId) {
    try {
      const result = await db.query(
        `INSERT INTO portfolios (name, user_id)
          VALUES ($1, $2)
          RETURNING id, name, user_id, created_at`,
        [name, userId]
      );

      const row = result.rows[0];
      return new Portfolio(...Object.values(row));

    } catch (error) {
      if (error.code === "23503") {
        throw new ExpressError(`Invalid user_id ${userId}.`, 403);
      } else if (error.code === "23505") {
        throw new ExpressError(`${name} already exists.`, 403);
      }
      throw error;
    }
  }

  /**
   * Update only portfolio name in database based on current instance; 
   * returns updated instance.
   */
  async update() {
    try {
      const result = await db.query(
        `UPDATE portfolios SET name=$2 
          WHERE id=$1
          RETURNING id, name, user_id, created_at`,
        [this.id, this.name]
      );

      if (result.rows.length === 0) {
        throw new ExpressError(`Cannot find portfolio_id:${this.id}`, 404);
      }

      return this;

    } catch (error) {
      if (error.code === "23505") {
        throw new ExpressError(`${this.name} already exists.`, 403);
      }
      throw error;
    }
  }

  /**
   * Deletes current instance from database.
   */
  async remove() {
    const result = await db.query(
      `DELETE FROM portfolios WHERE id=$1 RETURNING *`,
      [this.id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Cannot find portfolio_id:${this.id}`, 404);
    }
  }
}


module.exports = Portfolio;