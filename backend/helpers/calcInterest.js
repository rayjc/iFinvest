/**
 * Calculate and return the interest acculumated given current price and initial price.
 * @param {Number} price 
 * @param {Number} initialPrice 
 */
function calcInterest(price, initialPrice) {
  return price / initialPrice - 1.0;
}

module.exports = calcInterest;