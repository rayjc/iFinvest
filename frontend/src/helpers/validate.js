/**
 * Return true if date lands on a weekday; otherwise return false
 * @param {String} dateStr 
 */
const validateWeekday = (dateStr) => {
  const day = new Date(dateStr).getUTCDay();
  return day !== 0 && day !== 6;
};

/**
 * Return true if startDate is earlier than endDate; otherwise return false
 * @param {String} startDate 
 * @param {String} endDate 
 */
const validateStartEndDates = (startDate, endDate) => (
  new Date(startDate) <= new Date(endDate)
);


export { validateWeekday, validateStartEndDates };