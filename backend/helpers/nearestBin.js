/**
 * Given the number of days, computed the nearest time window for IEX API.
 * @param {Number} days 
 */
function nearestWindow(days) {
  if (days > 2 * 365) {
    return '5y';
  } else if (days > 365) {
    return '2y';
  } else if (days > 183) {
    return '1y';
  } else if (days > 90) {
    return '6m';
  } else if (days > 30) {
    return '3m';
  } else {
    return '1m';
  }
}


function nearestInterval(window) {
  const table = {
    '5y': 72,
    '2y': 28,
    '1y': 14,
    '6m': 7,
    '3m': 4,
    '1m': 1
  };

  return table[window];
}

module.exports = { nearestWindow, nearestInterval };