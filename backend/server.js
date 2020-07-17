/** Start server for iFinvest. */

const app = require("./app");
const { PORT } = require("./config");
const initDb = require("./helpers/initDb");

// populate database with stock symbols
initDb();

app.listen(PORT, function() {
  console.log(`Server starting at http://localhost:${PORT}`);
});
