// npm packages
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// app imports
const app = require("../../app");
const db = require("../../db");


// global auth variable to store things for all the tests
const TEST_DATA = {};

async function beforeAllHook() {

}

/**
 * Hooks to insert a user, company, and job, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
  try {
    // login a user, get a token, store the user ID and token
    const hashedPassword = await bcrypt.hash("secret", 1);
    const user = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email)
        VALUES ('test', $1, 'test', 'user', 'test@test.com')
        RETURNING id, username, first_name, last_name, email`,
      [hashedPassword]
    );

    TEST_DATA.currUser = user.rows[0];

    const response = await request(app)
      .post("/login")
      .send({
        username: "test",
        password: "secret",
      });

    TEST_DATA.userToken = response.body.token;
    TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;
    TEST_DATA.currentUserId = jwt.decode(TEST_DATA.userToken).id;


    const stock = await db.query(
      `INSERT INTO stocks (symbol, name, exchange, ipo_date, region, currency, type)
        VALUES ('GOOG', 'Google', 'NASDAQ', '2000-01-01', 'us', 'USD', 'te')
        RETURNING *`
    );
    TEST_DATA.stock = stock.rows[0];

    const appleStock = await db.query(
      `INSERT INTO stocks (symbol, name, exchange, ipo_date, region, currency, type)
        VALUES ('AAPL', 'Apple', 'NASDAQ', '2002-01-01', 'us', 'USD', 'te')
        RETURNING *`
    );
    TEST_DATA.appleStock = appleStock.rows[0];

    const portfolio = await db.query(
      `INSERT INTO portfolios (name, created_at, user_id)
        VALUES ('alpha', '2020-01-20', $1) RETURNING *`,
      [TEST_DATA.currentUserId]
    );
    TEST_DATA.portfolio = portfolio.rows[0];

    const investment = await db.query(
      `INSERT INTO investments (start_date, end_date, initial_value, symbol, portfolio_id)
        VALUES ('2010-02-25', '2020-01-01', 1000, $1, $2) RETURNING *`,
      [TEST_DATA.stock.symbol, TEST_DATA.portfolio.id]
    );
    TEST_DATA.investment = investment.rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function afterEachHook() {
  try {
    await db.query("DELETE FROM investments");
    await db.query("DELETE FROM portfolios");
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM stocks");
  } catch (error) {
    console.error(error);
  }
}

async function afterAllHook() {
  try {
    // await db.query("DROP TABLE IF EXISTS investments");
    // await db.query("DROP TABLE IF EXISTS portfolios");
    // await db.query("DROP TABLE IF EXISTS users");
    // await db.query("DROP TABLE IF EXISTS stocks");
    await db.end();
  } catch (err) {
    console.error(err);
  }
}

test("smoke test for set up", function() { });


module.exports = {
  afterAllHook,
  afterEachHook,
  TEST_DATA,
  beforeAllHook,
  beforeEachHook,
};
