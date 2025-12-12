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
 * Calculate sum of all transaction amounts
 * @name sumTransactionAmounts
 * Sum Transaction Amounts
 * @param {scope} globals Global scope object
 * @return {number} Total sum of all transaction amounts
 */
function sumTransactionAmounts(globals) {
  const formData = globals.functions.exportData();

  // Check if transactions exist and is an array
  if (!formData.transactions || !Array.isArray(formData.transactions)) {
    return 0;
  }

  // Sum all transaction amounts
  const total = formData.transactions.reduce((sum, transaction) => {
    const amount = parseFloat(transaction.transaction_amount) || 0;
    return sum + amount;
  }, 0);

  return total;
}

// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, submitFormArrayToString, sumTransactionAmounts };
