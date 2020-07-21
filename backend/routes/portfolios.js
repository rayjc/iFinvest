const express = require("express");

const ExpressError = require("../helpers/expressError");
const Portfolio = require("../models/portfolio");
const portfolioSchema = require("../schemas/portfolio.json");
const portfolioPatchSchema = require("../schemas/portfolioPatch.json");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const validateJSON = require("../helpers/validateJson");
const { nearestInterval, nearestWindow } = require("../helpers/nearestBin");
const calcInterest = require("../helpers/calcInterest");
const ApiHelper = require('../helpers/apiHelper');

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


/**
 * Respond with interest data of portfolio in json.
 * eg.
 * {
 *    interests: [
 *        {date: '2019-01-30', AAPL: 0.0, GOOG: 0.0, ...},
 *        ...,
 *        {date: '2019-6-20', APPL: 2.1, GOOG: 2.0, MSFT: 0.0},
 *        ...
 *    ]
 *    cutoffs: [
 *        {date: '2020-2-10', symbol: 'AAPL'}, ...
 *    ]
 * }
 */
router.get("/chart/:portfolioId", ensureLoggedIn, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.get(+req.params.portfolioId, true);
    // check if userId matches user_id of portfolio
    if (portfolio.user_id !== req.user.id) {
      throw new ExpressError(
        `Unauthorized; only user with id:${portfolio.user_id} can view ${portfolio.name}.`,
        401
      );
    }

    const { investments } = portfolio;
    // TODO: remember to disable weekend dates on date picker
    // extract min and max time window
    const startDates = investments.map(inv => inv.start_date);
    const earliestDate = new Date(Math.min(...startDates));
    const approxWin = new Date() - earliestDate;
    // convert time window to days
    const days = Math.round(approxWin / (1000 * 60 * 60 * 24));
    // set window according to available range provided by API
    const window = nearestWindow(days);
    const interval = nearestInterval(window);

    const table = {};
    const cutoffs = [];
    // send API request to get chart data for each investment
    for (let investment of investments) {
      const { symbol, start_date, end_date } = investment;

      try {
        // get initial value from db if available
        const initialPrice = investment.initial_price
          ? investment.initial_price
          : (await ApiHelper.getSingleDataPoint(symbol, start_date)).close;
        const initialDate = start_date.toISOString().split('T')[0];

        // update table to store the initial closing interest
        if (!table.hasOwnProperty(initialDate)) {
          table[initialDate] = {};
        }
        table[initialDate][symbol] = 0.0;

        const [sold, latest, data] = await Promise.all([
          // get closing price on the sell-off date
          end_date ? ApiHelper.getSingleDataPoint(symbol, end_date) : null,
          // get the last closing price from today
          ApiHelper.getLastClose(symbol),
          // get data points in between
          ApiHelper.getChartData(symbol, window, interval),
        ]);

        // update table to store the historical interests by its date
        for (let row of data) {
          if (new Date(row.date) < start_date) {
            // more rows could be returned by API since only a few ranges are available
            // filter out rows earlier than initial date
            continue;
          }
          if (!table.hasOwnProperty(row.date)) {
            table[row.date] = {};
          }
          table[row.date][symbol] = calcInterest(row.close, initialPrice);
        }

        // update table to store the lastest closing interest
        if (!table.hasOwnProperty(latest.date)) {
          table[latest.date] = {};
        }
        table[latest.date][symbol] = calcInterest(latest.close, initialPrice);

        // add date and price during sell-off
        if (sold) {
          cutoffs.push({
            symbol, date: sold.date,
            interest: calcInterest(sold.close, initialPrice)
          });
        }

      } catch (error) {
        throw Error(`Failed to get chart data from IEX for ${symbol}.`);
      }
    }

    // table: {
    //    '2019-01-30': {AAPL: 0.0, GOOG: 0.0,},
    //    '2019-02-20':  {AAPL: 0.002, GOOG: 0.003, MSFT: 0.001},
    // }
    // process table to required chart format
    const interests = Object.entries(table)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, val]) => ({ date, ...val }));

    return res.json({ interests, cutoffs });

  } catch (error) {
    return next(error);
  }
});


module.exports = router;