/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "test";

const PORT = +process.env.PORT || 3002;

const DB_URI = process.env.NODE_ENV === "test" ? "ifinvest_test" : "ifinvest";

const BCRYPT_WORK_FACTOR = 12;

const IEX_TOKEN = process.env.IEX_TOKEN || 'Tpk_1d32bebde96a47e78940ac13ab8fc06c';

const IEX_URL = process.env.IEX_URL || 'https://sandbox.iexapis.com/stable';

module.exports = {
  SECRET_KEY,
  PORT,
  DB_URI,
  BCRYPT_WORK_FACTOR,
  IEX_TOKEN,
  IEX_URL,
};
