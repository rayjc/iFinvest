const express = require("express");

const ExpressError = require("../helpers/expressError");
const Portfolio = require("../models/portfolio");
const portfolioSchema = require("../schemas/portfolio.json");
const portfolioPatchSchema = require("../schemas/portfolioPatch.json");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const validateJSON = require("../helpers/validateJson");

const router = new express.Router();


router.get("/:userId", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const portfolios = await Portfolio.getPortfolios(+req.params.userId);
    return res.json({ portfolios });

  } catch (error) {
    return next(error);
  }
});


router.post("/:userId", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    validateJSON(req.body, portfolioSchema);

    const portfolio = await Portfolio.create(req.body.name, +req.params.userId);
    return res.json({ portfolio });

  } catch (error) {
    return next(error);
  }
});


router.patch("/:userId/:portfolioId", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    validateJSON(req.body, portfolioPatchSchema);

    const portfolio = await Portfolio.get(+req.params.portfolioId);
    // check if userId matches user_id of portfolio
    if (portfolio.user_id !== +req.params.userId) {
      throw new ExpressError(
        `Unauthorized; only user with id:${portfolio.user_id} can update ${portfolio.name}.`,
        401
      );
    }

    if (req.body.name) {
      portfolio.name = req.body.name;
      const updatedPortfolio = await portfolio.update();
      return res.json({ portfolio: updatedPortfolio });
    }

    // return original portfolio
    return res.json({ portfolio });

  } catch (error) {
    return next(error);
  }
});


router.delete("/:userId/:portfolioId", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.get(+req.params.portfolioId);
    // check if userId matches user_id of portfolio
    if (portfolio.user_id === +req.params.userId) {
      await portfolio.remove();
      return res.json({ message: `Portfolio(${portfolio.name}) deleted` });
    }

    throw new ExpressError(
      `Unauthorized; only user with id:${portfolio.user_id} can remove ${portfolio.name}.`,
      401
    );

  } catch (error) {
    return next(error);
  }
});


module.exports = router;