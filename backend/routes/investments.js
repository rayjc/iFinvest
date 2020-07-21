const express = require("express");

const ExpressError = require("../helpers/expressError");
const Investment = require("../models/investment");
const Portfolio = require("../models/portfolio");
const investmentSchema = require("../schemas/investment.json");
const investmentPatchSchema = require("../schemas/investmentPatch.json");
const { ensureLoggedIn } = require("../middleware/auth");
const validateJSON = require("../helpers/validateJson");
const ApiHelper = require("../helpers/apiHelper");
const calcInterest = require("../helpers/calcInterest");


const router = new express.Router();


router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const investment = await Investment.get(+req.params.id);
    return res.json({ investment });

  } catch (error) {
    return next(error);
  }
});


router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    validateJSON(req.body, investmentSchema);

    const { initial_value, symbol, portfolio_id, start_date, end_date } = req.body;
    // check if portfolio belongs to user
    const portfolio = await Portfolio.get(portfolio_id);
    if (req.user.id !== portfolio.user_id) {
      throw new ExpressError(
        `Unauthorized; only user with id: ${portfolio.user_id} can modify ${portfolio.name}.`,
        401
      );
    }

    const investment = await Investment.create(
      initial_value, symbol, portfolio_id, start_date, end_date
    );

    return res.status(201).json({ investment });
  } catch (error) {
    return next(error);
  }
});


router.patch("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    validateJSON(req.body, investmentPatchSchema);

    const investment = await Investment.get(+req.params.id);
    // check if portfolio belongs to user
    const portfolio = await Portfolio.get(investment.portfolio_id);
    if (req.user.id !== portfolio.user_id) {
      throw new ExpressError(
        `Unauthorized; only user with id: ${portfolio.user_id} can modify ${portfolio.name}.`,
        401
      );
    }

    // update each field
    ["initial_value", "symbol", "start_date", "end_date"].forEach(function(field) {
      if (field in req.body) {
        investment[field] = req.body[field];
      }
    });

    const updatedInvestment = await investment.update();

    return res.json({ investment: updatedInvestment });

  } catch (error) {
    return next(error);
  }
});


router.delete("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const investment = await Investment.get(+req.params.id);
    // check if portfolio belongs to user
    const portfolio = await Portfolio.get(investment.portfolio_id);
    if (req.user.id !== portfolio.user_id) {
      throw new ExpressError(
        `Unauthorized; only user with id: ${portfolio.user_id} can modify ${portfolio.name}`,
        401
      );
    }

    await investment.remove();

    return res.json({ message: `Investment(${investment.symbol}) deleted.` });
  } catch (error) {
    return next(error);
  }
});


router.get("/interest/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const investment = await Investment.get(+req.params.id);
    const { symbol, start_date, end_date } = investment;
    const initial = await ApiHelper.getSingleDataPoint(symbol, start_date);
    // get price at sell off if sold, otherwise get current price
    const final = end_date
      ? await ApiHelper.getSingleDataPoint(symbol, end_date)
      : await ApiHelper.getLastClose(symbol);

    // store initial price to db to avoid additional API calls
    investment.initial_price = initial.close;
    await investment.update();

    return res.json({
      symbol, start_date: initial.date, end_date: final.date,
      interest: calcInterest(final.close, initial.close)
    });

  } catch (error) {
    return next(error);
  }
});

module.exports = router;