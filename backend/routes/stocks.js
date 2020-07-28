const express = require("express");

const ExpressError = require("../helpers/expressError");
const Stock = require("../models/stock");


const router = new express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { symbol } = req.query;
    const stocks = await Stock.findAll(symbol);
    return res.json({ stocks });

  } catch (error) {
    return next(error);
  }
});




module.exports = router;