/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Sum all transaction amounts from the repeatable transaction history panel
 * @name sumTransactionAmounts
 * Sum Transaction Amounts
 * @param {scope} globals Global scope object
 * @return {number} Total sum of all transaction amounts
 */
function sumTransactionAmounts(globals) {
  const transactionHistory = globals.form.transaction_history;

  // If no transaction history exists or it's empty, return 0
  if (!transactionHistory || !Array.isArray(transactionHistory)) {
    return 0;
  }

  // Sum all transaction amounts
  let total = 0;
  transactionHistory.forEach((transaction) => {
    const amount = transaction.transaction_amount1765454071360?.$value;
    if (amount && !isNaN(amount)) {
      total += Number(amount);
    }
  });

  return total;
}

// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, submitFormArrayToString, sumTransactionAmounts };
