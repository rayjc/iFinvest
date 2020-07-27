import ApiHelper from './apiHelper';


class PortfolioApi {
  /**
   * Get all portfolios under current user;
   * return [
   *    {id, name, user_id, created_at, investments:[ {id, symbol}, ... ]},
   *    ...
   * ]
   */
  static async getPortfolios() {
    return (await ApiHelper.request("portfolios")).portfolios;
  }

  /**
   * Get a detailed portfolio under current user;
   * return
   *    {id, name, user_id, created_at, investments:[ {id, symbol, initial_value, start_date, end_date}, ... ]},
   *    ...
   */
  static async getPortfolio(id) {
    return (await ApiHelper.request(`portfolios/${id}`)).portfolio;
  }

  /**
   * Create a new portfolio under current user;
   * return {id, name, user_id, created_at, investments:[]}
   * @param {String} name 
   */
  static async createPortfolio(name) {
    return (await ApiHelper.request("portfolios", { name, }, "post")).portfolio;
  }

  /**
   * Update the name of an existing portfolio under current user;
   * return {id, name, user_id, created_at, investments:[]}
   * @param {Number} id 
   * @param {String} newName 
   */
  static async updatePortfolio(id, newName) {
    return (
      await ApiHelper.request(`portfolios/${id}`, { name: newName }, "patch")
    ).portfolio;
  }

  /**
   * Remove an existing portfolio under current user;
   * return message string
   * @param {Number} id 
   */
  static async removePortfolio(id) {
    return (await ApiHelper.request(`portfolios/${id}`, undefined, "delete")).message;
  }

  /**
   * Get chart data of an existing portfolio;
   * return data like 
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
   * @param {Number} id 
   */
  static async getChart(id) {
    return await ApiHelper.request(`portfolios/chart/${id}`);
  }
}


export default PortfolioApi;