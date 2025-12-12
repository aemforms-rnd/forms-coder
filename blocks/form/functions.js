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
 * Calculate the sum of all transaction amounts from the repeatable transactions panel
 * @name sumTransactionAmounts
 * Sum Transaction Amounts
 * @param {scope} globals Global scope object
 * @return {number} Total sum of all transaction amounts
 */
function sumTransactionAmounts(globals) {
  const transactions = globals.form.transactions;

  // Check if transactions panel exists and is an array
  if (!transactions || !Array.isArray(transactions.$value)) {
    return 0;
  }

  // Sum all transaction amounts
  let total = 0;
  transactions.$value.forEach((transaction) => {
    const amount = transaction.transaction_amount1734001234590?.$value;
    if (amount && typeof amount === 'number') {
      total += amount;
    }
  });

  return Math.round(total * 100) / 100; // Round to 2 decimal places
}

// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, submitFormArrayToString, sumTransactionAmounts };
