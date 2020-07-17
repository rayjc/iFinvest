/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "test";

const PORT = +process.env.PORT || 3002;

const DB_URI = process.env.NODE_ENV === "test" ? "ifinvest-test" : "ifinvest";

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  SECRET_KEY,
  PORT,
  DB_URI,
  BCRYPT_WORK_FACTOR,
};
