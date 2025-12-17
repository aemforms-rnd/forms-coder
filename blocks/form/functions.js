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

/**
 * Calculate annual premium based on sum assured and age
 * Formula: 2% of sum assured + 0.1% for each year above 25
 * @name calculateAnnualPremium
 * Calculate Annual Premium
 * @param {number} sumAssured Sum assured amount
 * @param {string} dateOfBirth Date of birth in date format
 * @param {scope} globals Global scope object
 * @return {number} Calculated annual premium
 */
function calculateAnnualPremium(sumAssured, dateOfBirth, globals) {
  // Return 0 if sum assured is not provided
  if (!sumAssured || sumAssured === 0) {
    return 0;
  }

  // Calculate age from date of birth
  let age = 0;
  if (dateOfBirth) {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    if (!Number.isNaN(dob.getTime())) {
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
      }
    }
  }

  // Base premium: 2% of sum assured
  let premium = sumAssured * 0.02;

  // Additional charge: 0.1% for each year above 25
  if (age > 25) {
    const yearsAbove25 = age - 25;
    premium += sumAssured * (yearsAbove25 * 0.001); // 0.1% = 0.001
  }

  // Round to 2 decimal places
  return Math.round(premium * 100) / 100;
}

// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, submitFormArrayToString, sumTransactionAmounts, calculateAnnualPremium };
