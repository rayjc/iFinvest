import ApiHelper from './apiHelper';


class InvestmentApi {
  /**
   * Get an investment row based on id from backend;
   * return {
   *   id, initial_value, initial_price, symbol, portfolio_id,
   *   start_date, end_date
   * }
   * @param {Number} id 
   */
  static async getInvestment(id) {
    return (await ApiHelper.request(`investments/${id}`)).investment;
  }

  /**
   * Create an investment row given object containing investment data;
   * return {
   *   id, initial_value, initial_price, symbol, portfolio_id,
   *   start_date, end_date
   * }
   * @param {Object} investment - { initial_value, symbol, portfolio_id,
   *  start_date, end_date }
   */
  static async createInvestment(investment) {
    return (await ApiHelper.request("investments", investment, "post")).investment;
  }

  /**
   * Update an existing investment row given an investment object containing 
   * fields to be updated;
   * return {
   *   id, initial_value, initial_price, symbol, portfolio_id,
   *   start_date, end_date
   * }
   * @param {Number} id 
   * @param {Object} investment - {initial_value, symbol, start_date, end_date}
   */
  static async updateInvestment(id, investment) {
    return (
      await ApiHelper.request(`investments/${id}`, investment, "patch")
    ).investment;
  }

  /**
   * Remove an existing investment row based on id;
   * return message string
   * @param {Number} id 
   */
  static async removeInvestment(id) {
    return (await ApiHelper.request(`investments/${id}`, undefined, "delete")).message;
  }

  /**
   * Get the accumulated interest rate of an invesment;
   * return {symbol, start_date, end_date, interest}
   * @param {Number} id 
   */
  static async getInterest(id) {
    return await ApiHelper.request(`investments/interest/${id}`);
  }
}


export default InvestmentApi;