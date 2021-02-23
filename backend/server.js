/** Start server for iFinvest. */

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, function() {
  console.log(`Server starting at http://localhost:${PORT}`);
});
