/** Express backend for iFinvest. */

const express = require("express");
const morgan = require("morgan");

const ExpressError = require("./helpers/expressError");
const { authenticateJWT } = require("./middleware/auth");
const loginRoutes = require("./routes/login");
const usersRoutes = require("./routes/users");
const portfoliosRoutes = require("./routes/portfolios");
const investmentsRoutes = require("./routes/investments");
const stockRoutes = require("./routes/stocks");


const app = express();
// set up body parsing
app.use(express.json());

// add logging system
app.use(morgan("tiny"));

// get jwt auth token for all routes
app.use(authenticateJWT);

app.use("/login", loginRoutes);
app.use("/users", usersRoutes);
app.use("/portfolios", portfoliosRoutes);
app.use("/investments", investmentsRoutes);
app.use("/stocks", stockRoutes);


/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});


/** general error handler */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
