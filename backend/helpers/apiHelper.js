const { IEX_TOKEN, IEX_URL } = require('../config');
const axios = require('axios');
const ExpressError = require('./expressError');

class ApiHelper {
  static async request(endpoint, paramsOrData = {}, verb = "get") {
    // console.debug("API Call:", endpoint, paramsOrData, verb);

    try {
      return (await axios({
        method: verb,
        url: `${IEX_URL}/${endpoint}`,
        [verb === "get" ? "params" : "data"]: paramsOrData
      })).data;
      // axios sends query string data via the "params" key,
      // and request body data via the "data" key,
      // so the key we need depends on the HTTP verb
    }

    catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getSingleDataPoint(symbol, date) {
    const data = await ApiHelper.request(
      `stock/${symbol}/chart/date`,
      {
        token: IEX_TOKEN,
        exactDate: date.toISOString().split('T')[0].split('-').join(''),
        chartByDay: true,
      }
    );
    if (data.length === 0) {
      throw new ExpressError('No data found; possible invalid date.', 400);
    }
    return { date: data[0].date, close: data[0].close };
  }

  static async getLastClose(symbol) {
    const data = await ApiHelper.request(
      `stock/${symbol}/chart/1m`,
      {
        token: IEX_TOKEN,
        chartCloseOnly: true,
        chartLast: 1,
      }
    );
    if (data.length === 0) {
      throw new ExpressError('No data found.', 400);
    }
    return { date: data[0].date, close: data[0].close };
  }

  static async getChartData(symbol, window, interval) {
    const data = await ApiHelper.request(
      `stock/${symbol}/chart/${window}`,
      {
        token: IEX_TOKEN,
        chartCloseOnly: true,
        chartInterval: interval,
      }
    );
    return data.map(({ date, close }) => ({ date, close }));
  }

}

module.exports = ApiHelper;