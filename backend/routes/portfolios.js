const express = require("express");

const ExpressError = require("../helpers/expressError");
const Portfolio = require("../models/portfolio");
const portfolioSchema = require("../schemas/portfolio.json");
const portfolioPatchSchema = require("../schemas/portfolioPatch.json");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const validateJSON = require("../helpers/validateJson");

const router = new express.Router();


router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const portfolios = await Portfolio.getPortfolios(req.user.id);
    return res.json({ portfolios });

  } catch (error) {
    return next(error);
  }
});


router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    validateJSON(req.body, portfolioSchema);

    const portfolio = await Portfolio.create(req.body.name, req.user.id);
    return res.status(201).json({ portfolio });

  } catch (error) {
    return next(error);
  }
});


router.patch("/:portfolioId", ensureLoggedIn, async (req, res, next) => {
  try {
    validateJSON(req.body, portfolioPatchSchema);

    const portfolio = await Portfolio.get(+req.params.portfolioId);
    // check if userId matches user_id of portfolio
    if (portfolio.user_id !== req.user.id) {
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


router.delete("/:portfolioId", ensureLoggedIn, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.get(+req.params.portfolioId);
    // check if userId matches user_id of portfolio
    if (portfolio.user_id === req.user.id) {
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