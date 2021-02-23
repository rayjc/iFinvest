const ExpressError = require("../helpers/expressError");
const tickerTrie = require("../ticker");


class Stock {
  constructor(symbol, name, exchange, ipo_date, region, currency, type) {
    this.symbol = symbol;
    this.name = name;
    this.exchange = exchange;
    this.ipo_date = ipo_date;
    this.region = region;
    this.currency = currency;
    this.type = type;
  }

  static async getAll() {
    const stocks = [];
    // loop through each uppercase alphabet
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      // map each stock object to Stock
      const stocksStartWithLetter = tickerTrie.get(letter)
        .map(stock => new Stock(...Object.values(stock)));
      // extend stocks array
      stocks.concat(stocksStartWithLetter);
    }

    return stocks;
  }

  static async findAll(symbol) {
    return tickerTrie.get(symbol.toUpperCase())
      .map(stock => new Stock(...Object.values(stock)));
  }
}


module.exports = Stock;